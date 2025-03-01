import React, { createContext, useContext, useEffect , useState} from 'react'
import axios from 'axios';

const GlobalContext = createContext();


axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

export const GlobalContextProvider = ({ children }) => {
    

   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [auth0User, setAuth0User] = useState(null);
   const [userProfile, setUserProfile] = useState({});
   const [loading, setLoading] = useState(false);
   
   
   const [jobTitle, setJobTitle] = useState("");
   const [jobDescription, setJobDescription] = useState("");
   const [salary, setSalary] = useState(0);
   const [salaryType, setSalaryType] = useState("Year");
   const [tags, setTags] = useState([]);
   const [skills, setSkills] = useState([]);
   const [negotiable, setNegotiable] = useState(false);
   const [activeEmploymentTypes, setActiveEmploymentTypes] = useState([]);
   const [location, setLocation] = useState({
    country: "",
    city: "",
    address: "",
   });

//    Handle change input

const handleTitleChange = (e) => {
    setJobTitle(e.target.value.trimStart())
}
const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value.trimStart())
}
const handleSalaryChange = (e) => {
    setSalary(e.target.value.trimStart())
}

   useEffect(() => {
       const checkAuth = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/check-auth");
            setIsAuthenticated(res.data.isAuthenticated);
            setAuth0User(res.data.user);
            setLoading(false);
        } catch (error)  {
            console.log("Error checking auth", error)
        }finally {
            setLoading(false);
        }

    }
    checkAuth();
   },[])


   const getUserProfile = async(id) => {
    try {
           const res = await axios.get(`/api/v1/user/${id}`)
           setUserProfile(res.data);
    } catch (error) {
        console.log("Error getting user profile", error)
    }
}


useEffect(() => {
    if(isAuthenticated && auth0User) {
        getUserProfile(auth0User.sub)
    }
},[isAuthenticated, auth0User])



    return (
        <GlobalContext.Provider value={{
            isAuthenticated,
            auth0User,
            userProfile,
            getUserProfile,
            loading,
            jobTitle,
            setJobDescription,
            jobDescription,
            salary,
            activeEmploymentTypes,
            salaryType,
            setNegotiable,
             setSalaryType, 
             salaryType,
            negotiable,
            tags,
            skills,
            location,
            handleTitleChange,
            handleDescriptionChange,
            handleSalaryChange,
            setActiveEmploymentTypes


        }}>
            {children}
        </GlobalContext.Provider>
    )
}


export const useGlobalContext = () => { 
    return useContext(GlobalContext)
}

