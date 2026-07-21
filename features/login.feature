
Feature: Login
              As a registered user
              I want to log in to the application
  So that I can access the dashboard



        @C5948
        Scenario Outline: title
            Given the user launches the application
             When the user logs in with valid username "<username>" and password "<password>" credentials
        Examples:
                  | username          | password               |
                  | sagesyntaxacademy | BuildingExcellence@111 |
        
             
             
             