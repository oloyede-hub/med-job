import React, { createContext, useContext, useEffect, useState } from "react"
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import toast from "react-hot-toast";
const JobsContext = createContext();




axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;
export const JobsContextProvider = ({ children }) => {
  const { userProfile } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [userJobs, setUserJobs] = useState([]);


  const getJobs = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/v1/jobs");
      setJobs(res.data)
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false)
    }
  }
  const createJob = async (jobData) => {
    try {
      const res = await axios.post("/api/v1/jobs", jobData);
      toast.success("Job created successfully");
      setJobs(prevJobs => [res.data, ...prevJobs]);
      // Update user job
      if (userProfile._id) {
        setUserJobs(prevUserJobs => [res.data, ...prevUserJobs]);
      }
    } catch (error) {
      console.log("Error creating jobs", error);
    }
  }


  const getUserJobs = async (userId) => {
    setLoading(true)
    try {
      const res = await axios.get("/api/v1/jobs/user/" + userId);
      setUserJobs(res.data)
      setLoading(false)
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false)
    }
  }


  const searchJobs = async (tags, location, title) => {
    setLoading(true);
    try {
      // build a query string
      const query = new URLSearchParams();
      if (tags) query.append("tags", tags)
      if (location) query.append("location", location)
      if (title) query.append("title", title);

      //  send request
      const res = await axios.get(`/api/v1/jobs/search?${query.toString()}`);
      // set job to the response data
      setJobs(res.data)
      setLoading(false)
    } catch (error) {
      console.log("Error searching jobs", error);
    } finally {
      setLoading(false)
    }
  }

  // Get job by id
  const getJobById = async (id) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/v1/jobs/${id}`);
      setLoading(false)
      return res.data;
    } catch (error) {
      console.log("Error getting jobs", error);
    } finally {
      setLoading(false)
    }
  }


  const likeJob = async (jobId) => {
    setLoading(true)
    try {
      const res = axios.put(`/api/v1/jobs/like/${jobId}`);
      toast.success("Job liked Successfully")
      getJobs()
    } catch (error) {
      console.log("Error getting jobs", error);
    } 
  }


  const applyToJob = async (jobId) => {
    setLoading(true)
    try {
      const res = axios.put(`/api/v1/jobs/apply/${jobId}`);
      toast.success("Applied to Job Successfully")
      getJobs()
    } catch (error) {
      console.log("Error Applying for job", error);
      toast.error(error.response.data.message);
    } 
  }



  // Delete job

  const deleteJob = async (jobId) => {
    try {
      const res = axios.delete(`/api/v1/jobs/${jobId}`);
      setJobs(prevJob => prevJob.filter(job => job._id !== jobId))
      searchJobs(prevJob => prevJob.filter(job => job._id !== jobId));
      toast.success("Job deleted Successfully")

      getJobs()
    } catch (error) {
      console.log("Error deleting for job", error);
      toast.error(error.response.data.message);
    } 
  }

  useEffect(() => {
    getJobs();
  }, []);



  useEffect(() => {
    if (userProfile._id) {
      getUserJobs(userProfile._id);
    }
  }, [userProfile]);

  console.log("Search Jobs", jobs);
  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      createJob,
      userJobs,
      searchJobs,
      getJobById,
      likeJob,
      applyToJob,
      deleteJob
    }}>
      {children}
    </JobsContext.Provider>
  )
}

export const useJobContext = () => {
  return useContext(JobsContext);
}