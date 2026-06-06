"use client"

import { useEffect } from "react"
import axios from 'axios'



const Builder = ({ params }: { params: { id: string } }) => {

    const { id } = params

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/workflow/${id}`)
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }, [])

    return (
        <div>Builder</div>
    )
}

export default Builder