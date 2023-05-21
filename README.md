# weatherAPI

This project is a RESTful API for a weather app. It allows users to retrieve current weather conditions for a specific location, as well as historical weather data for a given time range. The API integrates with the OpenWeatherMap API provider to obtain the weather data and returns it in a standardized format.

## Table of Contents

- [Endpoints](#endpoints)
- [Request and Response Format](#request-and-response-format)
- [Weather API Provider](#weather-api-provider)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Postman Requests](#postman-requests)
- [Swagger Documentation](#swagger-documentation)
- [Caching](#caching)
- [API Authentication](#api-authentication)
- [Getting Started](#getting-started)

## Endpoints

The API provides the following endpoints for retrieving weather data:

- `/weather/current/:location`: Returns the current weather conditions for a specific location.
- `/weather/forecast/:location`: Returns the weather forecast for a specific location and time.
- `/weather/history/:location`: Returns historical weather data for a specific location and time.

## Request and Response Format

Each endpoint expects specific parameters in the request and returns the weather data in a standardized format. The request and response formats for each endpoint are as follows:

- `/weather/current/:location`:
  - Request: Expects a `:location` parameter specifying the location for which to retrieve the current weather conditions.
  - Response: Returns a JSON object containing the current weather conditions for the specified location.

- `/weather/forecast/:location`:
  - Request: Expects a `:location` parameter specifying the location for which to retrieve the weather forecast.
  - Response: Returns a JSON object containing the weather forecast for the specified location.

- `/weather/history/:location`:
  - Request: Expects a `:location` parameter specifying the location, and a `date` query parameter specifying the date for which to retrieve historical weather data.
  - Response: Returns a JSON object containing the historical weather data for the specified location and date.

## Weather API Provider

This API uses OpenWeatherMap API provider to obtain the weather data.

## Error Handling

Error handling includes:

- Invalid location inputs: If the user enters an invalid location, the API returns a 400 Bad Request error with a error message.
- Server errors: If there are any server-side errors or issues with the OpenWeatherMap API, appropriate error responses with messages are returned.

## Logging

Logging is implemented in the API to assist with debugging and troubleshooting.

## Postman Requests

A collection of Postman requests has been created to represent the endpoints of this API. The collection includes sample requests and responses, along with comments and descriptions for better understanding and usage.

To access the Postman collection, please refer to the: https://api.postman.com/collections/27408203-bfdd14ea-02c8-4942-bcf7-18121b0b3b61?access_key=PMAT-01H0Z5Z735NG22MEC54369JVQK

## Swagger Documentation

To access the Swagger documentation, please refer to the: http://localhost:3000/api-docs

## Caching

To improve performance, caching is implemented in this API.

## API Authentication

To ensure only authorized users can access the API, authentication using basic authentication is implemented. Users and their passwords can be stored in files. This authentication mechanism secures the API from unauthorized access and protects user data.

## Getting Started

1. Clone the repository from https://github.com/ajdin0/weatherAPI.git
2. Install the necessary packages.
3. Set the environment variables (or use .env file provided):
   - `API_KEY`: Obtain an API key from the OpenWeatherMap API provider.
   - `USERNAME`: Set your username for API authentication.
   - `PASSWORD`: Set your password for API authentication.
4. Run the application.
5. The API will be accessible at `http://localhost:3000`
