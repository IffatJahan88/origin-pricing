@smoke
Feature: Origin pricing plan PDF validation

  Scenario: Search address, open plan in new tab, download PDF and assert it is Gas
    Given I am on the pricing page
    When I search for an address "17 Bolinda Road, Balwyn North, VIC 3104"
    And I verify the plans list is displayed
    And I uncheck the Electricity checkbox
    And I verify the plans list is still displayed
    And I click on the Origin Everyday Rewards Variable plan link in the Plan BPID/EFS column
    And Verify that the plan details page opens in a new tab
    And Download the PDF to the local file system
    Then I verify that the PDF content confirms it is a Gas plan




