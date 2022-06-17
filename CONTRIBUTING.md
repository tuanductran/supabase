# Contributing to Supabase

- [Development Setup](#development-setup)
  - [Installing Dependencies](#installing-dependencies)
- [To Develop Locally](#to-develop-locally)
- [Monorepo](#monorepo)
  - [Getting Started](#getting-started)
  - [Shared Components](#shared-components)
  - [Installing Packages](#installing-packages)
  - [Development](#development)
  - [Common Tasks](#common-tasks)
    - [Adding Redirects](#adding-redirects)
  - [Choosing Directory](#choosing-directory)
- [Docs](#docs)
  - [Getting Started](#getting-started)
  - [Development](#development)
- [Studio](#studio)
  - [Getting Started](#getting-started)
  - [Development](#development)
- [Finally](#finally)
- [Community Channels](#community-channels)

## Development Setup

Thank you for your interest in Supabase and for wanting to contribute! before you begin, read the [code of conduct](https://github.com/supabase/.github/blob/main/CODE_OF_CONDUCT.md) and check out some existing [issues](https://github.com/supabase/supabase/issues) to see what to work on.

Supabase is in the process of migrating this repository to a monorepo, using Turborepo. Eventually, the docs and the Studio will be run using Turborepo, which will significantly improve the developer workflow. You must be using NPM 7 or higher.

### Installing Dependencies

Before you can start contributing to Supabase, you must install and configure the following dependencies on your machine:

- [Git](http://git-scm.com/)

- [Node.js v16.x (LTS)](http://nodejs.org)

- [docker](https://www.docker.com/) (optional but recommended for studio)

- [npm](https://www.npmjs.com/) version 7+.

- [supabase repository](https://github.com/supabase/supabase/fork)

## To Develop Locally

To Develop Supabase Locally, you need clone your fork of the Supabase repository:

2. Clone your forked repository:

   ```sh
   git clone https://github.com/<github_username>/supabase.git
   ```

3. Go to the Supabase directory:
   ```sh
   cd supabase
   ```

You can now start developing Supabase locally.

## Monorepo

### Getting Started

```sh
npm install # install dependencies
npm run dev # start all the applications
```

Then visit and edit any of the following sites:

- `/apps/www`: http://localhost:3000
  - The main website.
- `/apps/temp-docs`: http://localhost:3001
  - We are migrating the docs to a Next.js site.
- `/apps/temp-community-forum`: http://localhost:3002
  - pulls all our github discussions into a nextjs site. Temporary/POC
- `/apps/temp-community-tutorials`: http://localhost:3003
  - pulls all our DEV articles (which community members can write) into a nextjs site. Temporary/POC

### Shared Components

The monorepo has a set of shared components under `/packages`:

- `/packages/common`: Common React code, shared between all sites.
- `/packages/config`: All shared config
- `/packages/tsconfig`: Shared Typescript settings

### Installing Packages

Installing a package with NPM workspaces requires you to add the `-w` flag to tell NPM which workspace you want to install into.

The format is: `npm install <package name> -w=<workspace to install in>`.

For example:

- `npm install @supabase/ui -w common`: installs into `./packages/common`
- `npm install @supabase/ui -w www`: installs into `./apps/www`

You do not need to install `devDependencies` in each workspace. These can all be installed in the root package.

### Development

To see your changes you will need to start a development server.

`npm run dev`

before you push your new code to GitHub, you need to run `npm run build` to compile your code and `npm run start` to start the production server.

## Common Tasks

### Adding Redirects

To add a redirect, simply create a new entry in the [`next.config.js`](https://github.com/supabase/supabase/blob/master/apps/www/next.config.js) file in our main site.

## Docs

### Getting Started

To work on the docs you will need to cd into the directory and install the dependencies. Don't forget to check out the [docs readme]() for more information.

```sh
cd web
```

```sh
npm install
```

### Development

```sh
npm run build
```

```sh
npm run serve
```

## Studio

### Getting Started

To get started with the studio, you will need to cd into the directory and install the dependencies.

```sh
cd web
```

```sh
npm install
```

After you have installed the dependencies, you will need to open another terminal window and start up docker.

```sh
docker-compose up
```

Now you can start the studio. Do not forget to check out the [studio readme]() for more information.

### Development

```sh
npm run dev
```

## Finally

After making your changes to the file(s) you'd like to update, it's time to open a pull request. Once you submit your pull request, the Supabase team/community will review it with you. Once your PR has been merged, you will be proudly listed as a contributor in the [contributor chart](https://github.com/supabase/supabase/graphs/contributors)

## Community Channels

Stuck somewhere? Have any questions? please join the [Discord Community Server](https://discord.supabase.com/) or the [Github Discussions](https://github.com/supabase/supabase/discussions). We are here to help!
