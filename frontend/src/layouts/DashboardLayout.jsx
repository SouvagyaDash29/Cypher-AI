import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ChatList from '../components/ChatList'

const DashboardLayout = () => {
	const { userId, isLoaded } = useAuth()

	const navigate = useNavigate();
	useEffect(() => {
	if(isLoaded && !userId){
		navigate("/sign-in");
	}
	}, [isLoaded, userId, navigate])
	
	if(!isLoaded) return "....Loading"


  return (
	<div className="flex gap-10 pt-5 h-[100%]">
		<div className="flex-1"><ChatList /></div>
		<div className="flex-[5] bg-[#12101b]">
			<Outlet />
		</div>
	</div>
  )
}

export default DashboardLayout