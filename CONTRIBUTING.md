**Thank you for your interest in contributing to the `purify-html` project!**

The algorithm for making a contribution is somewhat different, depending on the type of contribution.

# cases

## RP aimed at fixing bugs that are not vulnerabilities.

- First of all, create an issue describing the problem. In the issue, indicate that you want to create a PR.
- After reviewing the issue and deciding that it is indeed a bug, you will be given the opportunity to contribute (priority acceptance of your PR).
- For any changes, create a `bugfix/#<x>` branch, where `x` is the issue id.

## RP aimed at fixing vulnerabilities.

Follow the link `https://github.com/Aleksandr-JS-Developer/purify-html/security/advisories/new` and fill out the form. If you are not sure how to fill out the form - just write what you can. Please allow time for correction (or correct it yourself) before posting any information publicly.

## RP aimed at adding new functionality.

`purify-html` is positioned as a minimalist and fast tool. This means that the addition of any new functionality should be driven by a specific need. But, despite this, the functionality you proposed will be considered and analyzed in detail.

- Create an issue with a proposal for new functionality and indicate that you want to create a PR.
- Wait for approval to add functionality.
- Submit your PR.

## RP aimed at updating documentation

- Create an issue stating what you want to fix or add and indicate that you want to create a PR.
- Wait for approval.
- Submit your PR.

## another RP target

- Create an issue stating what you want to fix or add and indicate that you want to create a PR.
- Wait for approval.
- Submit your PR.

# How to

First - create fork.

Second - download project & install depends

```bash
mkdir purify-html
cd purify-html
git clone <fork-repo> .
npm install
npm run test
```

If all tests passed successfully, it means that you have installed and configured the project correctly.

To run tests, type `npm run test` or `npm run test-watch`.

Before submitting a PR, make sure all tests pass and eslint shows no errors.

Also, `purify-html`, due to its compactness, has 100% test coverage. It will be just great if you add tests for all your changes. PRs without a single test are accepted, but before merging into `main` we will be forced to write unit tests ourselves.
