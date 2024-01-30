# Pydantic: A brief introduction to data validation and structure in Python
##### 10 min read
In this post, I explore <a href="https://docs.pydantic.dev/latest/" target="_blank">Pydantic</a>, a Python library that transforms the way developers handle data validation and data structures. I found Pydantic very useful to create data models, validate and parse data to the specified types, serialize data using multiple formats such as JSON, and much more! 

## tl;dr
>Pydantic is a Python library designed for easy data validation and settings management using Python type annotations. It helps in automating the process of validating and parsing data, ensuring that the data is accurate and structured correctly. Although Python has some built-in methods for dealing with typing and data structures, Pydantic allows to handle **Data validation, Type hints, and Serialization** very easily and efficiently.

## Python's Dynamic typing: A blessing and a curse
When I started learning Python, one feature that grabbed my attention was the **dynamic typing**. That means you can declare a variable without specifying the data type. Even, you can override it afterwards! I felt that learning to code couldn't be easier.

```Python
var = 1
print(var)

var = "This is a string"
print(var)

# OUTPUT
# 1
# 'This is a string'
```

However, after working on several projects, I realized that the dynamic typing can create some problems as the application grows. Dynamic typing makes it hard to keep track of all variables and their types, and the problem gets bigger when dealing with functions. Even if the function is descriptive enough, the argument data types can be hard to infer. Moreover, when dealing with objects, dynamic typing allows the creation of invalid objects.

```Python
# Typing
def locate_object(coords):
    longitude, latitude = coords
    return f"Lon: {longitude}- Lat: {latitude}"

# Data structure
class City():
    def __init__(self, name, population):
        self.name = name
        self.population = population


toronto = City(name="Toronto", population=2.93)
assert isinstance(toronto.population, float) # Correct

toronto = City(name="Toronto", population="2.93") 
assert isinstance(toronto.population, float) # Incorrect
```
In the first example, it cannot be inferred if `coords` is a tuple, list, or a dict. Moreover, when the function is used later on, we must remember the data types for the function's inputs and outputs. In the second example, if we expect the `population` attribute to be a float, the object will be created even if the user input is a string, but it will fail later on when using it in other parts of our application (as in the second instance).

## Type hints and Data Classes in Python
To overcome the issues of Dynamic Typing and Data structure, Python implements `typing` and `dataclasses` modules since versions 3.5 and 3.7 respectively (for more details check <a href="https://docs.python.org/3/library/typing.html" target="_blank">typing</a> and <a href="https://docs.python.org/3/library/dataclasses.html" target="_blank">dataclasses</a>). Then, the examples from the previous section can be updated as follows.

```Python
from typing import Tuple
from dataclasses import dataclass

# Typing
def locate_object(coords: Tuple[float, float]) -> str:
    longitude, latitude = coords
    return f"Lon: {longitude}- Lat: {latitude}"

# Data structure
@dataclass
class City():
    name: str
    population: float

toronto = City(name="Toronto", population=2.93)
assert isinstance(toronto.population, float) # Correct

toronto = City(name="Toronto", population="2.93") 
assert isinstance(toronto.population, float) # Incorrect
```

In the first example, the use of typing enhances the readability of our code. Additionally, many linters support typing, so we don't need to remember the data types for each function in our application. In the second example, the City instance is created even though the data type is not a float (in the second try). In both examples, the `dataclasses` method does not enforce the data types and is just for improving the readability and lint support. Note that the decorator `@dataclass` implements the `__init__` method under the hood.

## Pydantic: the "Swiss army knife" of data validation
Pydantic is a data validation library that is widely used by different projects and companies such as **Django, FastAPI, HuggingFace, OpenAI, and among others**. In addition to the powerful data validation managing, Pydantic also helps with the type hints in several IDE and to perform JSON Serialization, which makes it perfect to parse data from external APIs into our applications.

>In addition to these use cases, interest in Pydantic has grown in recent months as some people are using it to handle structured outputs from Large Language Models (LLMs). In fact, the first time I heard about Pydantic was in this context. I will explore this topic in a future blog entry.

To begin with, we can install Pydantic by running ```pip install pydantic```, then, we will review two of the most helpful use cases: Data validation and JSON Serialization.

### Data validation

Coming back to our City class example, we can use Pydantic to define our class (in a similar way than the `dataclasses` method). However, Pydantic attempts to parse the inputs to match the defined data types. If it fails, it will raise a `ValidationError`. In this case, the string '2.93' is converted into the float 2.93, which is awesome!

```Python
from pydantic import BaseModel

class City(BaseModel):
    name: str
    population: float 

toronto = City(name="Toronto", population=2.93)
assert isinstance(toronto.population, float) # Correct

toronto = City(name="Toronto", population="2.93") 
assert isinstance(toronto.population, float) # Correct (Pydantyc parsed the value as float)
```

>**Note**: When trying this code, check the type hints in your IDE. Now working with your code will be so much easier!

Remember in the last section when we wanted to enforce the data type for object creation? Now, Pydantic will raise a `ValidationError` if the data type is not the same and the parsing failed.

```Python
bogota = City(name="Bogota", population="Hello World!")

# OUTPUT
# -----------------------------------------------------------------
# ValidationError: 1 validation error for City
# population
#   value is not a valid float (type=type_error.float)
```

In addition to the common data types (e.g. `int`,`str`,`float`,`bool`), Pydantic implements a lot of custom data types such as `URLs`,`email`,`regex`, among others.

```Python
# You might need this library. Otherwise, comment it
!pip install pydantic[email]

from pydantic import (
    BaseModel,
    EmailStr
)
class City(BaseModel):
    name: str
    population: float
    email: EmailStr

bogota = City(name="Bogota", population=7.2, email="info@bogota.gov.co")
print(bogota)

# This line will raise a ValidationError because of the invalid email
toronto = City(name="Toronto", population=2.93, email="Hello World!") 
# OUTPUT
# name='Bogota' population=7.2 email='info@bogota.gov.co'
# -----------------------------------------------------------------
# ValidationError: 1 validation error for City
# email
#  value is not a valid email address (type=value_error.email)
```
In addition, Pydantic also allows the implementation of custom validators to manage specific needs.

```Python
from pydantic import (
    BaseModel,
    EmailStr,
    validator
)
class City(BaseModel):
    name: str
    population: float
    email: EmailStr

    @validator("population")
    def validate_population(cls, value):
        if value <= 0:
            raise ValueError(f"Population must be positive: {value}")
        return value
        
# This line will raise a ValidationError because of negative population
bogota = City(name="Bogota", population=-20.0, email="info@bogota.gov.co") 
# OUTPUT
# -----------------------------------------------------------------
# ValidationError: 1 validation error for City
# population
#  Population must be positive: -20.0 (type=value_error)
```

### JSON Serialization

JSON is a common standard data format that allows exchange of information between web applications (using APIs). Therefore, another great use case of Pydantic is the JSON serialization (and deserialization) which makes really easy to convert Pydantic data models from and to JSON.

```Python
# Use the .json method to convert a Data model to JSON
toronto_json = toronto.json()
print(toronto_json)

# OUTPUT
# {"name": "Toronto", "population": 2.93}

# Instead, use the .dict method if you want a Python Dict representation
toronto_dict = toronto.dict()
print(toronto_dict)

# OUTPUT
# {'name': 'Toronto', 'population': 2.93}

# For JSON deserialization, use the method .parse_raw()
toronto_str = '{"name":"Toronto", "population": 2.93, "email": "info@toronto.ca"}'
toronto = City.parse_raw(toronto_str)
print(toronto)

# OUTPUT
# name='Toronto' population=2.93 email='info@toronto.ca'
```

## Conclusions
Wrapping up, Pydantic stands out as a powerful and versatile tool in the Python developer's toolkit. Its ability to seamlessly handle data validation, type hints, and serialization bridges the gap between Python's dynamic nature and the need for robust, error-free data handling in larger applications. This is especially crucial in projects involving complex data structures or interactions with external APIs.

Integrating Pydantic can significantly reduce the time and effort spent on debugging and validating data. So, the next time you find yourself juggling with data validation or structure in Python, consider giving Pydantic a try. It might just make your coding journey a bit smoother and certainly more enjoyable. Keep an eye out for future posts where we'll dive deeper into Pydantic's advanced features and explore its potential in even more scenarios. Happy coding!







