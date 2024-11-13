"use client"
import React from 'react'
import { useState, useEffect, useRef, } from 'react'
import { FaPlay, FaPause, FaHeart, FaVolumeUp, FaVolumeMute, FaForward, FaBackward, FaSearch, } from 'react-icons/fa';
import axios from 'axios';
import { UserContext } from '../context';
import { useContext } from 'react';
const page = () => {
    const [data, setdata] = useState(null)
    const [currentSong, setCurrentSong] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(50);
    const [progress, setProgress] = useState(0);
    const [mute, setmute] = useState(false)
    const [id, setid] = useState(null)
    const [liked, setliked] = useState(null)
    const [del, setdel] = useState(null)
    const { user } = useContext(UserContext)
    useEffect(() => {
        if (user !=null) {
          setCurrentSong(user)
        }
      }, [user])
    useEffect(() => {
        const getposts = async () => {
            const response = await axios.get('/api/user')
            const data = response.data;
            if (data.message != "Error GETTING posts") {
                setdata(data)
                setFilteredData(data)
            }
        }
        getposts()

    }, [])
    useEffect(() => {
        if (id != null) {

            const getposts = async () => {
                const response = await fetch('/api/liked', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });

                const data = await response.json();
                setliked(data.newUser);
            }
            getposts()
        }


    }, [id,])
    useEffect(() => {
        if (del != null) {

            const getposts = async () => {
                const response = await fetch('/api/liked', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ del }),
                });

                const data = await response.json();
                setliked(data);
            }
            getposts()
        }


    }, [del,])


    useEffect(() => {


        const getposts = async () => {
            const response = await fetch('/api/liked', {
                method: 'GET',
            });

            const data = await response.json();
            setliked(data);
        }
        getposts()


    }, [])
    const audioRef = useRef(null);

    const handleNextSong = () => {
        audioRef.current.pause();
        const currentIndex = data.indexOf(currentSong);
        const nextSong = data[(currentIndex + 1) % data.length];
        setCurrentSong(nextSong);
    };

    const handlePreviousSong = () => {
        audioRef.current.pause();
        const currentIndex = data.indexOf(currentSong);
        const previousIndex = (currentIndex + data.length - 1) % data.length;
        const previousSong = data[previousIndex];
        setCurrentSong(previousSong);
    };
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.onended = () => {
            handleNextSong();
        };
        audioRef.current.ontimeupdate = () => {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        };
    }, []);
    useEffect(() => {


        if (currentSong != null && audioRef.current) {

            // Stop previous audio playback
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = `/songs/${currentSong.song}`;
            audioRef.current.load();
            setPlaying(true);
            audioRef.current.play();
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };

    }, [currentSong]);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    const handleVolumeChange = (e) => {
        if (audioRef.current) {
            audioRef.current.volume = e.target.value / 100;
        }
        setVolume(e.target.value);
    };

    const handleProgressChange = (e) => {
        if (audioRef.current) {
            audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
        }
    };

    const volumeset = () => {
        if (volume > 1 && audioRef.current) {
            audioRef.current.volume = 0;
            setVolume(0);
        } else if (volume == 0 && audioRef.current) {
            audioRef.current.volume = 1;
            setVolume(100)
        }
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = (e) => {
        if (data != null) {
            const searchValue = e.target.value.toLowerCase();
            setSearchTerm(searchValue);

            const filtered = data.filter((item) =>
                item.title.toLowerCase().includes(searchValue)
            );
            setFilteredData(filtered);
        }
    };

    return (
        <>
            <div className="home text-white h-[93vh] w-[77vw]  bg-neutral-800 my-5  overflow-y-auto  hide-scroll ">
                <div className="bg-gradient-to-b from-emerald-800 pt-10 ">

                    <div
                        className="cursor-pointer  mx-5 flex h-[60px] w-[550px] items-center gap-3 rounded-[20px] bg-black group"  >
                        <FaSearch className=' ml-3 text-neutral-400  size-8' />
                        <input type='text' placeholder='Search the Songs' style={{
                            outline: 'none',
                            border: 'none',
                            boxShadow: 'none',
                        }}
                            value={searchTerm}
                            onChange={handleSearch}
                            className='border-none bg-transparent text-white p-2 w-[400px] data-[state=on]:border-none' />
                    </div>

                    <div className="flex text-white text-[30px] font-bold p-5">All Songs</div>
                </div>
                <div className="flex flex-col p-2 items-start gap-3 ">
                    {filteredData?.map((item) => (
                        <div key={item.id} className="flex p-2  w-[500px] gap-1 bg-black rounded-[10px] group relative ">
                            <div className="flex gap-3 items-center">
                                <img src={`/pic/${item.pic}`} className='cursor-pointer w-[80px] h-[80px]' />
                                <div className="flex flex-col gap-1 ">
                                    <text className='text-white font-[400] text-[15px]'>{item.title}</text>
                                    <text className='text-neutral-400 font-[400] text-[12px]  overflow-hidden h-[20px]'>{item.desc}</text>
                                </div>
                                <div className="rounded-full cursor-pointer absolute right-4 bottom-7 p-3 bg-green-500 hidden group-hover:block" >
                                    <img src="play.png" onClick={() => setCurrentSong(item)} className='w-[20px] ' />
                                </div>

                            </div>
                        </div>))}
                </div>

                <div className="flex w-[50vw] h-[80px]">

                </div>
                {currentSong && (
                    <div className="fixed z-10 bottom-3 right-0 bg-green-800 h-[70px] w-[100vw]  ">

                        <img className='w-[60px]  absolute left-1 h-[60px] bottom-1  rounded-[10px]' src={`/pic/${currentSong.pic}`} />
                        <div className="absolute left-[75px] ">
                            <div className="flex flex-col gap-2 pt-3">
                                <h3 className='text-neutral-300 text-[12px] '>{currentSong.desc}</h3>
                                <h3 className='text-neutral-300 text-[12px] ' >{currentSong.title}</h3>
                            </div>
                        </div>




                        {liked != null && liked.some((item) => item.songid === (currentSong.id)) ? (
                            <FaHeart
                                onClick={() => setdel((currentSong.id))}
                                className='size-8 top-5 absolute left-[320px] cursor-pointer text-red-700'
                            />
                        ) : (
                            <FaHeart
                                onClick={() => setid((currentSong.id))}
                                className='size-8 top-5 absolute left-[320px] cursor-pointer'
                            />
                        )}


                        <div className="flex justify-center mt-5">
                            <div className="controls flex flex-row gap-5  justify-end ">
                                <FaBackward className='cursor-pointer' onClick={handlePreviousSong} />
                                {playing ? (
                                    <FaPause className='cursor-pointer' onClick={handlePlayPause} />
                                ) : (
                                    <FaPlay className='cursor-pointer' onClick={handlePlayPause} />
                                )}
                                <FaForward className='cursor-pointer' onClick={handleNextSong} />
                            </div>
                            <div className="volume-control absolute right-5 flex gap-1 ">
                                {mute == false ? <FaVolumeUp className='cursor-pointer' onClick={() => { volumeset(); setmute(!mute) }} /> :
                                    <FaVolumeMute className='cursor-pointer' onClick={() => { volumeset(); setmute(!mute) }} />}
                                <input
                                    className='cursor-pointer'
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                />

                            </div>

                        </div>
                        <div className="flex justify-center mt-2" >
                            <div className="progress-bar flex">
                                <input
                                    className='w-[40vw] cursor-pointer'
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}

export default page