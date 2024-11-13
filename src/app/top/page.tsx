"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import axios from 'axios';
import Link from 'next/link';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { FaSearch, FaHome } from 'react-icons/fa';
import { UserContext } from '../context';
import { useContext } from 'react';




const Top = () => {
    const [addsong, setaddsong] = useState(false)
    const [pic, setpic] = useState("")
    const [song, setsong] = useState("")
    const [data, setdata] = useState(null)
    const ref = useRef()
    const [message, setmessage] = useState("")
    const { setUser } = useContext(UserContext)

    useEffect(() => {
        const getposts = async () => {
            const response = await axios.get('/api/user')
            const data = response.data;
            if (data.message != "Error GETTING posts") {
                setdata(data)
            }
        }
        getposts()

    }, [])
    const handlesubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('song', song);
        formData.append('pic', pic);
        formData.append('title', event.target[1].value);
        formData.append('desc', event.target[2].value);

        const response = await axios.post('/api/user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = response.data;
        setmessage(data.message);
        if (data.message == "Created Successfully") {
            window.location.reload()
        }

    };






    return (



        <div className="start">
            <ToggleGroup type="single">
                <div className='h-[20vh] w-[20vw] flex flex-col m-5 py-4 bg-neutral-800 px-5 '>
                    <Link href="/">
                        <ToggleGroupItem value="a" >

                            <div className="flex py-5 gap-4 " >

                                <FaHome className=' size-5 cursor-pointer' />

                                <text className='font-medium  text-md ' >Home</text>

                            </div>

                        </ToggleGroupItem>
                    </Link>
                    <Link href="/search">
                        <ToggleGroupItem value="b">

                            <div className="flex  gap-4 "   >
                                <FaSearch className=' size-5 cursor-pointer' />
                                <text className='  font-medium  text-md cursor-pointer' >Search</text>
                            </div>
                        </ToggleGroupItem>
                    </Link>
                </div>
            </ToggleGroup>
            <div className="h-[70vh] w-[20vw] mx-5 bg-neutral-800  ">
                <div className="flex  gap-4 justify-between  p-4 text-neutral-400 "   >
                    <div className=" flex gap-4">
                        <img className='filter invert w-5' src="libary.svg" alt="Home Icon" />
                        <text className='font-medium  text-md cursor-pointer' >Your Library</text>
                    </div>
                    <img src='plus.svg' onClick={() => setaddsong(!addsong)} className='w-5 cursor-pointer filter invert' />
                </div>
                <text className='text-white my-6 p-2'>List of Songs!</text>
                <div className="flex flex-col h-[54vh] overflow-y-auto  hide-scroll">
                    {data?.map((item) => (
                        <div key={item.id} onClick={()=>setUser(item)} className="flex gap-3 cursor-pointer items-center w-[18vw] m-[1vw] bg-black h-[70px] rounded-[10px]   ">
                            <img className='w-[60px] h-[60px]  rounded-[20px]' src={`/pic/${item.pic}`} />
                            <div  className="flex flex-col gap-2 ">
                                <h3 className='text-white text-[16px] ' >{item.title}</h3>
                                <h3 className='text-neutral-300 text-[12px] overflow-hidden w-[150px] h-[20px] '>{item.desc}</h3>

                            </div>

                        </div>
                    ))

                    }
                    <div className="flex min-h-[200px] w-[100px]">


                    </div>

                </div>
            </div>


            {addsong && <div className='absolute left-8 top-[220px]' >

                <form ref={ref} onSubmit={(e) => { handlesubmit(e); ref.current.reset() }} className='flex flex-col gap-1 justify-center items-center bg-black rounded-[20px]  h-[300px]   w-[250px]'>
                    <label className='text-white self-start pl-6'>Song</label>
                    <Input onChange={(e) => setsong(e.target.files[0])} className='text-black w-[200px] bg-white' name="song" type="file" />

                    <Input placeholder='Song Artist' className='text-black  bg-white  p-2 w-[200px] rounded=[20px] ' type="text" name="title" />
                    <Input placeholder='Song Description' className='text-black  bg-white  p-2 w-[200px] rounded=[20px] ' type="text" name="desc" />
                    <label className='text-white self-start pl-6'>Song pic</label>
                    <Input onChange={(e) => setpic(e.target.files[0])} className='text-black  bg-white   w-[200px] rounded=[20px] ' type="file" name="coverpic" accept="image/*" />
                    <button className='text-white bg-green-500 rounded-[20px] w-[150px] p-1' type="submit">Upload Song</button>
                    <text className='text-white'>{message}</text>
                </form>


            </div>}
        </div>

    )
};

export default Top;
