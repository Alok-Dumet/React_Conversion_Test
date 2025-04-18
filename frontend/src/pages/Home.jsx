//This is my React Page for the Home screen
//It returns html for the main page

//It is called as the function "Home()"

//Import the Link tag
import {Link} from "react-router-dom";

//Exporting the Home page. All HTML needs to be wrapped in a tag, so I made an empty tag
export default function Home() {
    return (
      <div className={styles.wrapper}>
        <h1>HIIIIIIIIIIIIIIII</h1>
        <div className="temp">
          <h1>Want to see your profile?</h1>
          <Link to="/profile">Click Here!</Link>
        </div>
      </div>
    );
  }
  