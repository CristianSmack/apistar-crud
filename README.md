# API Star CRUD
[![Build Status](https://travis-ci.org/PeRDy/apistar-crud.svg?branch=master)](https://travis-ci.org/PeRDy/apistar-crud)
[![codecov](https://codecov.io/gh/PeRDy/apistar-crud/branch/master/graph/badge.svg)](https://codecov.io/gh/PeRDy/apistar-crud)
[![PyPI version](https://badge.fury.io/py/apistar-crud.svg)](https://badge.fury.io/py/apistar-crud)

* **Version:** 0.4.0
* **Status:** Production/Stable
* **Author:** José Antonio Perdiguero López

## Features
API Star CRUD provides an easy way to define a REST resource and generic operations over it.

### Resource
The resources are classes with a default implementation for **methods**:
* `create`: Create a new element for this resource.
* `retrieve`: Retrieve an element of this resource.
* `update`: Update (partially or fully) an element of this resource.
* `delete`: Delete an element of this resource.
* `list`: List resource collection with **filtering** capabilities.
* `drop`: Drop resource collection.

### ORM
API Star CRUD supports the following ORM:
* [SQLAlchemy](https://www.sqlalchemy.org/) through [apistar-sqlalchemy](https://github.com/PeRDy/apistar-sqlalchemy).
* [Peewee](https://github.com/coleifer/peewee) through [apistar-peewee-orm](https://github.com/PeRDy/apistar-peewee-orm).

## Quick start
Install API Star CRUD:

```bash
$ pip install apistar-crud[peewee]
```

or 

```
$ pip install apistar-crud[sqlalchemy]
```

Follow the steps:

1. Create an **input type** and **output type** for your resource:
2. Define a **model** based on your ORM.
3. Build your **resource** using the metaclass specific for your ORM.
4. Add the **routes** for your resource.

## Usage
### SQLAlchemy
Example of a fully functional resource based on SQLAlchemy.

Create an **input type** and **output type**:

```python
class PuppyInputType(types.Type):
    name = validators.String()

class PuppyOutputType(types.Type):
    id = validators.Integer()
    name = validators.String()
```

Define a **model**:

```python
class PuppyModel(Base):
    __tablename__ = "Puppy"

    id = Column(Integer, primary_key=True)
    name = Column(String)
```

The **resource**:

```python
from apistar_crud.sqlalchemy import Resource

class PuppyResource(metaclass=Resource):
    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")
```

The resource generates his own **routes**:

```python
from apistar import Include

routes = [
    Include("/puppy", "Puppy", PuppyResource.routes),
]
```

### Peewee
Example of a fully functional resource based on Peewee.

Create an **input type** and **output type**:

```python
class PuppyInputType(types.Type):
    name = validators.String()

class PuppyOutputType(types.Type):
    id = validators.Integer()
    name = validators.String()
```

Define a **model**:

```python
class PuppyModel(peewee.Model):
    name = peewee.CharField()
```

The **resource**:

```python
from apistar_crud.peewee import Resource

class PuppyResource(metaclass=Resource):
    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")
```

The resource generates his own **routes**:

```python
from apistar import Include

routes = [
    Include("/puppy", "Puppy", PuppyResource.routes),
]
```

## Resources

### Routes
The routes for resource methods are:

|Method  |Verb  |URL
|--------|------|--------------
|create  |POST  |/
|retrieve|GET   |/{element_id}/
|update  |PUT   |/{element_id}/
|delete  |DELETE|/{element_id}/
|list    |GET   |/
|drop    |DELETE|/


### Override methods
To customize CRUD methods you can override them like:

```python
from apistar_crud.peewee import Resource

class PuppyResource(metaclass=Resource):
    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")
    
    @classmethod
    def create(cls, element: PuppyInputType) -> PuppyOutputType:
        # Do your custom process
```

### Filtering
Default `list` implementation has filtering capabilities but to reflect it in the schema is necessary to override that 
method defining all the parameters that will be used as a filter and pass it as keywords to `_list()` method. 

It is a direct translation to ORM keyword arguments 
so in case of SQLAlchemy it uses a `filter_by()` method and a `where()` in Peewee case.

```python
from apistar_crud.peewee import Resource

class PuppyResource(metaclass=Resource):
    model = PuppyModel
    input_type = PuppyInputType
    output_type = PuppyOutputType
    methods = ("create", "retrieve", "update", "delete", "list", "drop")
    
    @classmethod
    def list(cls, name: http.QueryParam) -> typing.List[PuppyOutputType]:
        return cls._list(name=name)
```
