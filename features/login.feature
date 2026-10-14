
Feature: Verify the Login Functionality of the Application
              As a registered user
              I want to log in to the application, So that I can access the dashboard


        @C5947
        Scenario Outline: title
            Given the user launches the application
             When the user logs in with valid username "<username>" and password "<password>" credentials
        Examples:
                  | username          | password               |
                  | sagesyntaxacademy | BuildingExcellence@111 |

        @C5948
        Scenario Outline: Verify the login functionality of the application using valid credential
            Given the user launches the application "<URL>"
            Given the user enters the valid username "<username>" and password "<password>"
            When the user clicks on login button
            Then the user should be redirected to the HomePage "<dashboardPage>"
        Examples:
                | URL                                | username          | password               | dashboardPage                           |
                | https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
                #| https://automationpracticehub.com/ | sagesyntaxacademy | BuildingExcellence@111 | https://automationpracticehub.com/home  |
        
             
             
             