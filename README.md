# Doljak Todo List Angular Library

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Available Routes](#available-routes)
- [Component Usage](#component-usage)
- [Default API Endpoints](#default-api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Customization Options](#customization-options)
- [Technical Stack](#technical-stack)
- [Compatibility](#compatibility)
- [Installation](#installation)
  - [Package Installation](#1-package-installation)
  - [Module Import](#2-module-import)
  - [API Configuration](#3-configure-api-endpoints)
  - [Route Setup](#4-add-routes-and-setup)
- [Development Setup](#development-setup)
  - [Basic Usage](#basic-usage)


## Overview 

A modular Angular library for task and user management, designed to seamlessly integrate into larger applications. Built with Angular 16+, it provides a complete solution for todo lists with authentication, customization, and administrative features.

## Key Features

* **Task Management:** Complete CRUD operations for todos
* **User Management:** Role-based access control (Admin/User)
* **Customization:** Configurable UI elements and permissions
* **Authentication:** Built-in auth system with route guards
* **Responsive Design:** Mobile-first approach
* **Modular Architecture:** Easy integration with existing projects

### Available Routes
- `/login` - Authentication page
- `/todo-list` - Main todo list interface
- `/cms` - Administrative panel (requires admin role)

### Component Usage
```html
// Basic todo list implementation
<doljak-lib-test ></doljak-lib-test>
```

### Default API Endpoints
```typescript
// Todo List
GET    /todos     // List all todos
POST   /todos     // Create new todo
PUT    /todos/:id // Update todo
DELETE /todos/:id // Delete todo

// Users
GET    /users     // List all users
POST   /users     // Create user
PUT    /users/:id // Update user
DELETE /users/:id // Delete user

// Configuration
GET    /configmap // Get system configuration
PUT    /configmap // Update configuration
```

### Authentication Flow
1. Initial Auth Check
   - Guards check for valid session
   - Redirects to login if needed
2. Login Process
   - Credentials validation
   - Role assignment
   - Token generation
3. Route Protection
   - Todo list: authenticated users
   - Admin panel: admin users only
   - Login: public access

### Customization Options
- Theme colors via SCSS variables
- Component behavior via configuration
- Route guards for custom authentication
- Custom API endpoints via injection tokens

## Technical Stack

* Angular 16+
* TypeScript 5.x
* RxJS 7.x
* JSON Server (for development)

## Compatibility

* Angular: ^16.0.0
* Node.js: >=16.x
* TypeScript: ^5.1.0


## Installation 

### 1. Install the package
```bash
npm install doljak-lib-to-do-list
```

### 2. Import required modules
```typescript
import { libRoutes } from 'doljak-lib-to-do-list';

// Appendix 3 Option 1
import { provideApiUrls } from 'doljak-lib-to-do-list'; 

// Appendix 3 Option 2
import {
  API_BASE_URL
  TODO_API_URL, 
  CMS_API_URL,
  AUTH_API_URL,
} from 'doljak-lib-to-do-list';

// Appendix 3 Option 3
import { 
  LIB_ENV,              //option 3a
  provideLibEnvironment //option 3b
} from 'doljak-lib-to-do-list';
```

### 3. Configure API endpoints

#### Option 1: Using provideApiUrls
```typescript
// In your app.config.ts(standalone) or app.module.ts (ngmodule)

// ...existing code
  providers: [
    ...provideApiUrls({
      baseUrl: 'http://your-api-domain.com',
      todoBaseUrl: 'http://your-todo-api.com',          // Optional
      cmsBaseUrl: 'http://your-cms-api.com',            // Optional
      authBaseUrl: 'http://your-auth-api.com'           // Optional
      configmapBaseUrl: 'http://your-configmap-api.com' // Optional 
    })
  ]
// ...existing code  
```

#### Option 2: Using providers

```typescript
// In your app.config.ts(standalone) or app.module.ts (ngmodule)

// ...existing code
  providers[
    // ...existing code
    { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
    { provide: TODO_API_URL, useValue: 'https://todo.api.com' },    // Optional
    { provide: CMS_API_URL, useValue: 'https://cms.api.com' },      // Optional
    { provide: AUTH_API_URL, useValue: 'https://auth.api.com' },    // Optional
  ]
// ...existing code  
```

#### Option 3: Using LibEnvironment

First, define your environment endpoints:

```typescript
// filepath: src/environments/environment.ts
const LIB_ENV_VALUE:LibEnvironment = {
  apiBaseUrl: 'http://your-api-domain.com', 
  endpoints:  
    getUsers: '/you-path-to-users', // Optional, default /users
    getUser: '/user',               // Optional, default /user
    login: '/login',                // Optional, default /login
    getTodos: '/todos'              // Optional, default /login
    configmap: '/configmap'         // Optional, default /configmap
  };
```

Second, In your app.config.ts (standalone) or app.module.ts (ng module)

```typescript
// filepath: src/environments/environment.ts
providers: [
    //...existing code

    // option 2a
    { provide: LIB_ENV, useValue: LIB_ENV_VALUE }

    // option 2b
    ...provideLibEnvironment(LIB_ENV_VALUE),
]
```

   
> You can set up the domain and endpoints together, and that will work.
Example:
> You can set up API_BASE_URL and the endpoint ConfigMap with your definitions, or
> You can import API_BASE_URL and CONFIGMAP_API_URL and define your definitions.


### 4. Add routes and setup

#### Standalone Components (recommended)
```typescript
// filepath: src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { libRoutes } from 'doljak-lib-to-do-list';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(libRoutes)
  ]
};
```

#### NgModule Setup
```typescript
// filepath: src/app/app.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { libRoutes } from 'doljak-lib-to-do-list';

@NgModule({
  imports: [
    RouterModule.forRoot(libRoutes)
  ],
  // ...existing code...
})
export class AppModule { }

```


### Development Setup

#### Basic Usage
```html
// filepath: src/app/app.component.html
<doljak-lib-test></doljak-lib-test>
```
For local development, we recommend installing these dependencies in your host project:

```bash
# Install required dev dependencies
npm install --save-dev json-server concurrently
```

Add this script to your package.json:

Remenber to configure your environment

Copy the mock database file to your project root:
```bash
$ cp node_modules/doljak-lib-to-do-list/mocks/json-server/db.json .
```

```json
//filepath: package.json
{
  "scripts": {
    "start": "ng serve --configuration=development",
    "json-server": "json-server --watch you/path/to/db.json",
    "start:dev:json-server": "concurrently \"npm run start\" \"npm run json-server\"",
  }
}
```

To run the application with mock API:
```bash
npm run start:dev:json-server
```

This will:
- Start JSON Server on port 3000 with mock data
- Run your Angular application
- Watch for changes in both the API and application

*Note: The mock database (db.json) provides sample data for todos, users, and configurations required by the library.*

