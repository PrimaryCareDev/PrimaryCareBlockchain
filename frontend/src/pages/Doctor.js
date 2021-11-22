import React, {useState} from 'react'
import { useAuth } from '../useAuth'
import { useHistory } from 'react-router'

const Doctor = () => {
    const [error, setError] = useState("")
    const { signout } = useAuth()
    const history = useHistory()

    async function handleLogout() {    
        try {
          await signout()
          history.push("/")
        } catch {
          setError("Failed to log out")
        }
      }

    return (
        <div>
            DOCTOR'S PAGE                       
                                        
            <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            onClick={handleLogout}>
                Log Out
            </button>
        </div>
    )
}

export default Doctor
