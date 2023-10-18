# Setting Up Angular Project with ESLint, Prettier, Husky, and lint-staged

In this guide, we will walk you through the steps to set up an Angular project with ESLint, Prettier, Husky, and lint-staged. These tools help maintain code quality and style in your Angular project.

## Prerequisites

Before you begin, make sure you have Angular CLI installed. If not, you can install it globally using npm:

```bash
npm install -g @angular/cli
```

## Step 1: Create a New Angular Project

```bash
ng new my-app
cd my-app
```

## Step 2: Install Required Dependencies

Install the necessary dependencies for ESLint, Prettier, Husky, and lint-staged.

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
npm install --save-dev husky lint-staged
npm install -g @angular-eslint/schematics
```

## Step 3: Create Configuration Files

### Create a .prettierrc File

Create a `.prettierrc` file with your Prettier configuration:

```json
{
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": true,
    "semi": true,
    "singleQuote": true,
    "quoteProps": "consistent",
    "trailingComma": "none",
    "bracketSpacing": true,
    "bracketSameLine": false,
    "arrowParens": "always",
    "requirePragma": false,
    "proseWrap": "preserve",
    "htmlWhitespaceSensitivity": "ignore",
    "vueIndentScriptAndStyle": true,
    "endOfLine": "lf",
    "embeddedLanguageFormatting": "auto",
    "singleAttributePerLine": false
}
```

### Create a .eslintignore File

Create a `.eslintignore` file to specify what ESLint should ignore:

```bash
package.json
package-lock.json
dist
e2e/**
karma.conf.js
commitlint.config.js
```

### Configure .editorconfig

You can create or edit your `.editorconfig` file with the following configuration:

```editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```

## Step 4: Configure ESLint

Create an `eslintrc.json` file and configure ESLint with the following:

```json
{
    "root": true,
    "ignorePatterns": ["projects/**/*"],
    "overrides": [
        {
            "files": ["*.ts"],
            "parserOptions": {
                "project": ["tsconfig.json"],
                "createDefaultProgram": true
            },
            "extends": [
                "plugin:@angular-eslint/recommended",
                "plugin:@angular-eslint/template/process-inline-templates",
                "plugin:prettier/recommended"
            ],
            "rules": {
                "@angular-eslint/directive-selector": [
                    "error",
                    {
                        "type": "attribute",
                        "prefix": "app",
                        "style": "camelCase"
                    }
                ],
                "@angular-eslint/component-selector": [
                    "error",
                    {
                        "type": "element",
                        "prefix": "app",
                        "style": "kebab-case"
                    }
                ]
            }
        },
        {
            "files": ["*.html"],
            "extends": ["plugin:@angular-eslint/template/recommended"],
            "rules": {}
        },
        {
            "files": ["*.component.html"],
            "extends": [
                "plugin:@angular-eslint/template/recommended",
                "plugin:prettier/recommended"
            ],
            "rules": {}
        }
    ]
}
```

## Step 5: Configure Husky

Configure Husky by creating `.husky/pre-commit` and `.husky/pre-push` scripts:

### .husky/pre-commit

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
npm run test
```

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
npm run test
```

## Step 6: Update package.json

Update your `package.json` with the following scripts:

```json
"scripts": {
  "lint": "npx eslint \"src/**/*.{js,jsx,ts,tsx,html}\" --quiet --fix",
  "format": "npx prettier \"src/**/*.{js,jsx,ts,tsx,html,css,scss}\" --write",
  "prepare": "husky install",
  "lint-staged": "lint-staged"
}
```

## Step 7: Create Environments

Generate environments for your project:

```bash
ng generate environments
```

## Step 8: Update environment.ts and environment.prod.ts

Edit the `environment.ts` and `environment.prod.ts` files according to your requirements.

## Step 9: Angular Configuration

Update the `angular.json` file with the necessary configurations for development and production.

## Step 10: Modify main.ts

In your `main.ts` file, remove `console.log()` statements in the production environment:

```ts
if (environment.production) {
  enableProdMode();
  window.console.log = () => {};
}
```

## Step 11: Configure .gitignore

Ensure your `.gitignore` file includes the following:

```bash
# Ignore Angular generated files
/dist/
/tmp/
/out-tsc/
/bazel-out/

# Node.js dependencies
/node_modules/
npm-debug.log
yarn-error.log

# IDE and editor specific files
.idea/
.project
.classpath
.c9/
*.launch
.settings/
.vscode/
.history/

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage/
/libpeerconnection.log
testem.log
/typings/

# System files
.DS_Store
Thumbs.db

# Angular Configuration
/angular.json

# TypeScript Configuration
/tsconfig.app.json
/tsconfig.json
/tsconfig.spec.json

# Node Package Manager
/package-lock.json
```

## Bonus Tips

When someone clones your project, they should:

1. Run `npm install` to install project dependencies.
2. Set up their own `.editorconfig` and code editor settings.
3. Configure Git for their environment (name and email).
4. Run `ng serve` to start the development server.

Now your Angular project is set up with ESLint, Prettier, Husky, and lint-staged to maintain code quality and style. Happy coding!
