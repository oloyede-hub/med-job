"use client";
import { useGlobalContext } from "@/context/globalContext";
import React, { useState } from "react";
import JobTitle from "./JobTitle";
import JobDetails from "./JobDetails";
import Skills from "./Skills";
import JobLocation from "./JobLocation";
function JobForm() {
  const {
    jobTitle,
    jobDescription,
    salaryType,
    activeEmploymentTypes,
    salary,
    location,
    skills,
    negotiable,
    tags,
  } = useGlobalContext();
  const sections = ["About", "Job Details", "Skills", "Location", "Summary"];
  const [currentSection, setCurrentSection] = React.useState(sections[0]);
  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const renderStages = () => {
    switch (currentSection) {
      case "About":
        return <JobTitle />;
      case "Job Details":
        return <JobDetails />;
      case "Skills":
        return <Skills />;
      case "Location":
        return <JobLocation />;

      default:
        break;
    }
  };

  const getCompletedColor = (section: string) => {
    switch (section) {
      case "About":
        return jobTitle && activeEmploymentTypes.length > 0
          ? "bg-[#7263f3] text-white"
          : "bg-gray-300";
      case "Job Details":
        return jobDescription && salary > 0
          ? "bg-[#7263f3] text-white"
          : "bg-gray-300";
      case "Skills":
        return skills.length && tags.length > 0
          ? "bg-[#7263f3] text-white"
          : "bg-gray-300";
      case "Location":
        return location.address || location.city || location.country
          ? "bg-[#7263f3] text-white"
          : "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };
  return (
    <div className="w-full flex gap-6">
      <div className="self-start w-[10rem] flex flex-col bg-white rounded-md shadow-sm overflow-hidden">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`pl-4 py-3 relative flex self-start items-start gap-2 font-medium ${
              currentSection === section ? "text-[#7263f3] " : "text-gray-500"
            }`}
            onClick={() => handleSectionChange(section)}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center border border-gray-400/60 justify-center text-gray-500 ${
                currentSection === section ? " text-white" : ""
              } ${getCompletedColor(section)}`}
            >
              {index + 1}
            </span>
            {section}
            {currentSection === section && (
              <span className="w-1 h-full absolute left-0 top-0 bg-[#7263F3] rounded-full"></span>
            )}
          </button>
        ))}
      </div>
      <form className="p-6 flex-1 bg-white rounded-lg self-start">
        {renderStages()}
        <div className="flex justify-end gap-4 mt-4">
          {currentSection !== "Summary" && (
            <button
              type="button"
              className="px-6 py-2 bg-[#7263F3] text-white rounded-md"
              onClick={() => {
                const currentIndex = sections.indexOf(currentSection);
                setCurrentSection(sections[currentIndex + 1]);
              }}
            >
              Next
            </button>
          )}
          {currentSection === "Summary" && (
            <button
              type="submit"
              className="px-6 py-2 bg-[#7263F3] text-white rounded-md"
            >
              Post a Job
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default JobForm;
