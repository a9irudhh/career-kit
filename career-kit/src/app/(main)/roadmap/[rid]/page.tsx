import { useParams } from 'next/navigation'
import React from 'react'

const RoadmapPage = () => {

    const { rid } = useParams() as { rid: string }

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold underline">Roadmap</h1>
                <p className="text-xl">Roadmap ID: {rid}</p>
            </div>
        </div>
    )
}

export default RoadmapPage