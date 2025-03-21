/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as TransactionsIndexImport } from './routes/transactions/index'
import { Route as TransactionsNewIndexImport } from './routes/transactions/new/index'
import { Route as TransactionsIdIndexImport } from './routes/transactions/$id/index'
import { Route as AuthSignupIndexImport } from './routes/auth/signup/index'
import { Route as AuthSigninIndexImport } from './routes/auth/signin/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TransactionsIndexRoute = TransactionsIndexImport.update({
  id: '/transactions/',
  path: '/transactions/',
  getParentRoute: () => rootRoute,
} as any)

const TransactionsNewIndexRoute = TransactionsNewIndexImport.update({
  id: '/transactions/new/',
  path: '/transactions/new/',
  getParentRoute: () => rootRoute,
} as any)

const TransactionsIdIndexRoute = TransactionsIdIndexImport.update({
  id: '/transactions/$id/',
  path: '/transactions/$id/',
  getParentRoute: () => rootRoute,
} as any)

const AuthSignupIndexRoute = AuthSignupIndexImport.update({
  id: '/auth/signup/',
  path: '/auth/signup/',
  getParentRoute: () => rootRoute,
} as any)

const AuthSigninIndexRoute = AuthSigninIndexImport.update({
  id: '/auth/signin/',
  path: '/auth/signin/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/transactions/': {
      id: '/transactions/'
      path: '/transactions'
      fullPath: '/transactions'
      preLoaderRoute: typeof TransactionsIndexImport
      parentRoute: typeof rootRoute
    }
    '/auth/signin/': {
      id: '/auth/signin/'
      path: '/auth/signin'
      fullPath: '/auth/signin'
      preLoaderRoute: typeof AuthSigninIndexImport
      parentRoute: typeof rootRoute
    }
    '/auth/signup/': {
      id: '/auth/signup/'
      path: '/auth/signup'
      fullPath: '/auth/signup'
      preLoaderRoute: typeof AuthSignupIndexImport
      parentRoute: typeof rootRoute
    }
    '/transactions/$id/': {
      id: '/transactions/$id/'
      path: '/transactions/$id'
      fullPath: '/transactions/$id'
      preLoaderRoute: typeof TransactionsIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/transactions/new/': {
      id: '/transactions/new/'
      path: '/transactions/new'
      fullPath: '/transactions/new'
      preLoaderRoute: typeof TransactionsNewIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/transactions': typeof TransactionsIndexRoute
  '/auth/signin': typeof AuthSigninIndexRoute
  '/auth/signup': typeof AuthSignupIndexRoute
  '/transactions/$id': typeof TransactionsIdIndexRoute
  '/transactions/new': typeof TransactionsNewIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/transactions': typeof TransactionsIndexRoute
  '/auth/signin': typeof AuthSigninIndexRoute
  '/auth/signup': typeof AuthSignupIndexRoute
  '/transactions/$id': typeof TransactionsIdIndexRoute
  '/transactions/new': typeof TransactionsNewIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/transactions/': typeof TransactionsIndexRoute
  '/auth/signin/': typeof AuthSigninIndexRoute
  '/auth/signup/': typeof AuthSignupIndexRoute
  '/transactions/$id/': typeof TransactionsIdIndexRoute
  '/transactions/new/': typeof TransactionsNewIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/transactions'
    | '/auth/signin'
    | '/auth/signup'
    | '/transactions/$id'
    | '/transactions/new'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/transactions'
    | '/auth/signin'
    | '/auth/signup'
    | '/transactions/$id'
    | '/transactions/new'
  id:
    | '__root__'
    | '/'
    | '/transactions/'
    | '/auth/signin/'
    | '/auth/signup/'
    | '/transactions/$id/'
    | '/transactions/new/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  TransactionsIndexRoute: typeof TransactionsIndexRoute
  AuthSigninIndexRoute: typeof AuthSigninIndexRoute
  AuthSignupIndexRoute: typeof AuthSignupIndexRoute
  TransactionsIdIndexRoute: typeof TransactionsIdIndexRoute
  TransactionsNewIndexRoute: typeof TransactionsNewIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  TransactionsIndexRoute: TransactionsIndexRoute,
  AuthSigninIndexRoute: AuthSigninIndexRoute,
  AuthSignupIndexRoute: AuthSignupIndexRoute,
  TransactionsIdIndexRoute: TransactionsIdIndexRoute,
  TransactionsNewIndexRoute: TransactionsNewIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/transactions/",
        "/auth/signin/",
        "/auth/signup/",
        "/transactions/$id/",
        "/transactions/new/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/transactions/": {
      "filePath": "transactions/index.tsx"
    },
    "/auth/signin/": {
      "filePath": "auth/signin/index.tsx"
    },
    "/auth/signup/": {
      "filePath": "auth/signup/index.tsx"
    },
    "/transactions/$id/": {
      "filePath": "transactions/$id/index.tsx"
    },
    "/transactions/new/": {
      "filePath": "transactions/new/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
