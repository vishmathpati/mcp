# Security Policy

## Supported Surface

Right now this project is early-stage. The main security-sensitive areas are:

- parsing untrusted pasted config
- rendering conversion output without executing input
- handling remote MCP metadata and auth-related guidance safely

## Reporting

Please do not open public issues for security problems that could put users at risk.

Instead, report them privately through GitHub security advisories or contact the maintainer directly through GitHub.

Include:

- affected file or feature
- minimal reproduction
- impact
- suggested fix, if you have one

## What To Expect

The project aims to:

- treat pasted content as data, not instructions
- fail loudly on unsupported formats
- avoid hidden network behavior during conversion
