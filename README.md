Express Kickstarter
---
This repository contains a set of configurations and a folder structure which provides the following:

- Fully configured express application
- TypeScript
- Tests configured with jester
- Folder Structure for scale (see below)
- YARN used as the package manager

How to use
---

1. Fork this repository
2. run `npm install`
3. run `npm run start`
4. To test run `npm run test`

Directory Structure
---
-- `repository root` - server and app main files, also configurations\
&nbsp;&nbsp;&nbsp;&nbsp; --`src` - contains all the implementation code\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--`foundation` - Code which will be shared by the implementation. Models, connectors, services, etc.\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;--`layers` - Contains implementations for different layers of the application. Could be api, data, security, etc.\
  --`test` - contains test files for app and server\
