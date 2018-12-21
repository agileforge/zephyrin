# Zephyrin - Mailer tool

## Synopsis

Zephyrin is a tool to send emails to a list of addresses, and attach a document that comes from a merge of a template and a data source document.

## Name

The name "Zephyrin" comes from an old comic series named "Dastardly and Muttley in their Flying Machines" where there is a homing pigeon named "Zephyrin".

## License

This project is developed under MIT license. See LICENSE file for details.

## Platform

As it seems there is no JS library to convert correctly a MS Word document (docx) to PDF, the conversion must use
ActiveX objects to launch MS Word native conversion. Because of that, for the moment, it can only be
used on Windows environment.

But as Zephyrin has been designed in an abstraction level that allow to implements other conversions. So free to you to implements render engines for other type of files.

# Get started

To generate a usable binary, get the sources, install packages and build.

```
npm install
npm run electron:windows
```
