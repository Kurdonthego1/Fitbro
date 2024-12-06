<div align = "center">

# FitBro

</div>

## Contributions
- [**Yuval Glozman 200482531**](https://github.com/YuvalCodes)
- [**Aaron Borja 200482770**](https://github.com/creationNA)
- [**Zana Osman 200489300**](https://github.com/Kurdonthego1)

## Table of Contents

1) [**Introduction**](#1-introduction)
2) [**Design Problem**](#2-design-problem)
    * 2.1) Problem Definition
    * 2.2) Project Charter
        * 2.2.1) Functions
        * 2.2.2) Objectives
        * 2.2.3) Constraints
3) [**Solution**](#3-solution)
    * 3.1) First Solution
    * 3.2) Second Solution
    * 3.3) Final Solution
        * 3.3.1) Components
        * 3.3.2) Features
        * 3.3.3) Environmental, Societal, Safety, and Economic Considerations
        * 3.3.4) Limitations
4) [**Teamwork**](#4-teamwork)
5) [**Project Management**](#5-project-management)
6) [**Conclusion and Future Work**](#6-conclusion-and-future-work)

## 1) **Introduction**

FitBro is a workout tracker application that guides users by being able to provide customized workouts, which evidently, assists them with time management at the gym, along with retention and consistency. 
FitBro hopes to provide an easy-to-use, accurate, and reliable workout tracking application that helps its users track their workouts, identify their performance, and make it an easier experience to care for your health at the gym.
We believe there is a need for an application that is tailored towards expereinced and first-time gym-goers that will help with workut tracking, as there has been a strong surge of people who want to start building good habits by working out.  

### **Upcoming Section Overview**
In the following sections, you will dive into the solutions, tools, and methodologies used to develop FitBro. Aside from the application itself, there are documents and information about how this project was managed throughout the 3 months given for this project. Because 4 months is all we could allott to the project, we have also discussed future steps and implementations we plan to carry out from this project. 

## 2) **Design Problem**


* **2.1) Problem Definition**

    For us and other people as well, consistency with their routine is a main struggle. Without a solution or a tool, users may be left in the dark and not be able to reach the fitness goal they set, leading to negative mental and physical impacts. Physically, users may undergo stagnation in their fitness journey due to improper planning, which causes them to become unmotivated to keep their routines on track. Our application aims to solve issues that help combat challenges that people struggle with by providing a tool that helps track progress, and provides easy-to-use workout templates to help users with consistency.

    [Business Case](Documents/Business%20Case.pdf)

* **2.2) Project Charter:**

    [Project Charter](Documents/Project%20Charter.pdf)

    * **2.2.1) Functions**
        - Workout tracking
        - Custom workout templates
        - Data syncing and saving
        - User friendly navigation

    * **2.2.2) Objectives**
        - Easy to use interface
        - Reliable data storing that is easy to retrieve
        - Accurate visualization of user performance
    
    * **2.2.3) Constraints**
        - Budget constraints
        - Team size
        - Time constraints, project needs to be completed in 3 months
        - Hardware and Software constraints


## 3) **Solution**
* **3.1) First Solution**

    Our first solution was a simple web application for tracking a workout features included were
    - Ability to “start” a workout and add different exercises to the workout.
    - Simple and easy use of application, didn’t involve user sign up/log in to access data.

    However we found that this solution would be missing lots of a the necessary features that would actually accomplish our goal of making tracking of exercises easier, as each time you started a workout, your previous workout data wouldn’t exist and therefore the action of logging your workout would only serve to benefit that individual workout. 

    This solution is a great idea for users who have never used a workout app and would like to see how it works for themselves, or for users who seldom go to the gym, but don't take it too seriously. As mentioned earlier, if these users want to start tracking their exercise and become more consistent with working out, they would need more features, which is something solution lacks.

    [Solution 1](https://github.com/Kurdonthego1/Fitbro/blob/main/Documents/Lo%20Fi%20Designs/Solution%201.pdf)

* **3.2) Second Solution**

    Our second solution is again a web application that would track workouts, this time utilizing user sign up/log in and data storing features, it would allow us to better provide the user with functions to make their workout tracking experience easier. 

    Features would include:
    - Start a workout from recommended templates or saved templates that the user has created
    - Save last workout data for an exercise, showing what the user last did in terms of reps and sets for a    particular exercise.
    - View exercises data to see improvement of different intervals of time
    - This is our current WIP solution, however we are still developing and figuring out features to better serve the user.

    [Solution 2](https://github.com/Kurdonthego1/Fitbro/blob/main/Documents/Lo%20Fi%20Designs/Solution%202.pdf)

* **3.3) Final Solution**

    Our final solution was a mixture of Solution 1 and Solution 2, it was a final combination of our low fidelity prototypes and user feedback. It focused on providing the necessary functions of the application that would ensure its viability while also maintaining realistic time standards due to the short time available to develop the solution. (Provide comparison chart)

* **3.3.1) Components**

    * View
        * HTML: Defines the basic structure and layout of the website.
        * Bootstrap: Provides pre-designed HTML, CSS, and JavaScript components for responsive and visually appealing designs.
        * CSS: Customizes styles for HTML elements to achieve the desired look and feel.
        * EJS: Renders dynamic HTML pages by injecting data from the Model, enabling personalized and interactive content.

    * Controller
        * Node.js: Serves as the runtime environment for running JavaScript code on the server.
        * Express.js: Manages HTTP requests and routing, acting as the intermediary between the View and the Model. It communicates with Mongoose to retrieve or modify data.
        * Passport.js: Handles user authentication and session management, providing methods for serialization and deserialization of user data.

    * Model
        * MongoDB: The NoSQL database that stores the application data in collections and documents.
        * Mongoose: A library that extends MongoDB, providing schema-based models to interact with the database using JavaScript code. It simplifies querying, updating, deleting, and inserting data.
        * Mongosh: A shell tool used to interact directly with the MongoDB database from the command line, allowing manual operations outside the JavaScript application.
<br />
<br />
<br />
![Comp Map](Documents/Charts/CompMapMVC.png)
<br />
<br />
<br />

* **3.3.2) Features:** 

    *   | Feature | Description |
        |----------|----------|
        | Registration | Ability for user to register an account for the application | 
        | Login | Ability for user to logic to use the application |
        | Start a Workout and Edit Workout/Exercises and Save workout | Ability for user to start a workout, add exercises from their own custom exercises or templated ones, add sets to the exercise, with reps and weight and confirm it. Removing sets and exercises is also available. Finally the user is able to save the workout with a name and description and an option to save the workout as a template |
        | Utilize Templated Workout | After saving a workout as a template, the user is able to reload that workout template into a brand new workout and edit values as they like |
        | Add custom exercises | Ability to create custom exercises into their own custom exercise list to utilize in all future workouts |

* **3.3.3) Environmental, Societal, Safety, and Economic Considerations:**
    
    - Our application has a positive societal impact as it encourages users to workout and provides a solution to help make their exercise routine more timely, organized and allows them to prioritize the workout.
    - Our engineering design also utilized the agile method to develop the application. We did this to save on development costs and ensure that our team is more efficient as we were a team of only 3 and the agile method is more effective in smaller teams.
    - To ensure the safety of the user and their data, we implemented authentication systems to help ensure that user information such as their password is protected. We also ensured not to collect any unnecessary information or information that we couldn’t guarantee the safety of. Finally to ensure that the application is usable and reliable we ran the application through numerous testing rounds to ensure all features worked.

* **3.3.4) Limitations**

    Our current solution has the following limitations:

    - Only working on computers: no mobile application as of yet, making it not as viable for users that don’t have laptops or computers.
    - Missing features: some features such as different variations of sets, or rest timing was not implemented as of yet. These features would greatly support the users exercise experience
    - Missing templated workouts: We didn’t implement templated workouts that a brand new user could utilize if they were unfamiliar with a good workout plan.

## 4) **Teamwork**

* September 15th - 21st, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20September%2015th,%202024.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20September%2015th,%202024.docx.pdf)

* September 29th - October 5th, 2024
    * [Meeting Minutes - Stakeholder Meeting](Documents/Meeting%20Minutes/Meeting%20Minutes%20Fit%20Bro%20October%204th,%202024.docx.pdf)
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20September%2029th%20-%20October%205th,%202024.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Sept%2029th%20-%20Oct%205th.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20Sept%2029th%20-%20October%205th,%202024.pdf)

* October 6th - 12th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20October%206th%20-%20October%2012th,%202024.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20October%2011th,%202024.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20October%206th%20-%2012th,%202024.pdf)

* October 13th - 19th, 2024
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20October%2013th%20-%2019th%202024.pdf)

* October 20th - 26th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20Oct%2020.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Oct%2020th.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20October%2020th%20-%2026th,%202024.docx.pdf)

* October 27th - November 2nd, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20November%2010th%20-%2016th,%202024.docx-1.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Oct%2027th%20-%20Nov%202.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20October%2027th%20-%20November%202nd.docx.pdf)
    * [Issue Log](/Documents/Issue%20Logs/Issue%20Log%20-%20October%2027th%20-%20November%202nd,%202024.docx.pdf)

* November 3rd - 9th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20Nov%203rd,%202024.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Nov%203rd%20.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/)
    * [Issue Log](Documents/Issue%20Logs/Issue%20Log%20-%20November%203rd%20-%209th,%202024.docx.pdf)

* November 10th - 16th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20November%2010th%20-%2016th,%202024.docx-1.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Nov%2010th%202024.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20November%2010th-16th,%202024.docx.pdf)
    * [Issue Log](Documents/Issue%20Logs/Issue%20Log%20-%20November%2010th%20-%2016th,%202024.docx.pdf)

* November 17th - 23rd, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20November%2017th%20-%2023rd.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Nov%2017th%20-%2023rd.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20Nov%2017th-%2023rd,%202024.docx.pdf)

* November 24th - 30th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20November%2024th%20-%2030th.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20November%2024th%20-%2030th.docx.pdf)
    * [Project Status Report](Documents/Project%20Status%20Report/Project%20Status%20Report%20November%2024th-30th,%202024.docx.pdf)

* December 1st - 7th, 2024
    * [Meeting Minutes](Documents/Meeting%20Minutes/Meeting%20Minutes%20Dec%201st,%202024.docx.pdf)
    * [Agenda](Documents/Meeting%20Agenda/Meeting%20Agenda%20Dec%201st.docx.pdf)


## 5) **Project Management**

<br />

![Activity Network](Documents/Charts/Project%20Activity%20Network.png)

<br />

![GanttChart](Documents/Charts/Project%20Gantt%20Chart.png)

[Milestone-Based Schedule](Documents/Milestone-Based%20Schedule.docx.pdf)

## 6) **Conclusion and Future Work**

## What was Achieved?

We created a functioning workout tracker app that allowed a user to register, login, create workouts, add custom exercseis and add them to the active workout. Add/Update sets and remove them. Remove exercises as needed. Finally finish the workout and save as a template if needed and could reuse the template on a new workout.

We also learned about the MVC design pattern and utilized to create our application.

Finally we learned a lot about new languages and how to utilize them to work together in unison to create a project.

### Lessons Learned

[Lessons Learned](Documents/Lessons%20Learned%20Report.docx.pdf)

## Future Recommendations and Design Improvements

Add templated workouts for users without knowledge of exercises

Implement on mobile application for easier user interaction while exercising.

Utilize more complex calculations and decision making algorithims between design choices

Introduce more diverse set options for more customaizable workouts

Workout Analytics and History Page

Increased use safety and privacy

Exportable data to CSV

Improved user feedback to better tell the user what the app is doing when interacting with it

API's and AI implementation for recommend workouts/exercises based on user trends.
