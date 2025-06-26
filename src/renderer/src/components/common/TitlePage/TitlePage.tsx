import React from 'react'

interface TitlePageProps {
  title: string
}

const TitlePage: React.FC<TitlePageProps> = ({ title }) => {
  return <h1 className="text-6xl font-bold italic text-left text-blue-500">{title}</h1>
}

export default TitlePage
