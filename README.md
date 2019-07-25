# mail-check

Check and try to fix email address list

## Table of contents

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Usage](#usage)
* [Authors](#authors)

<!-- vim-markdown-toc -->

## Install

```bash
yarn add mail-check
```

## Usage

```javascript
const check = require("./src/check");

check.massCheck([
	"nemanjan00@gmail.com",
	"ne@fsdfsdfsd.fd"
]).then((results) => {
	console.log(results);
});
```

## Authors

* [nemanjan00](https://github.com/nemanjan00)

