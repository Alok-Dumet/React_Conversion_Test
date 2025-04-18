import {useRef} from "react"

export default function Profile() {


  return(
    <>
      <h1>Your profile we saved in our database. Try to logout and log back in to see if we still have your email for proof</h1>

      <div class="profileDetails">
        <ul>
                <li>Username: {{user.userName}}</li>
                <li>Email: {{user.email}}</li>
        </ul>
      </div>
      <div class="logout">
        <button 
      </div>
    </>
  )
}