import { useContext } from 'react'
import { SherpaContext } from '../context/SherpaContext'

const useSherpaContext = () => {
  return useContext(SherpaContext)
}

export default useSherpaContext
