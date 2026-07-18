
Feature: Login
              As a registered user
              I want to log in to the application
  So that I can access the dashboard

        
            
        @Login
        Scenario Outline: title
            Given the user launches the application
             When the user logs in with valid username "<username>" and password "<password>" credentials
             Then the dashboard should be displayed
        Examples:
                  | username          | password               |
                  | sagesyntaxacademy | BuildingExcellence@111 |
        
             
             
             