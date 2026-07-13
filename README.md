# An Open Letter to NVIDIA

An open letter calling on NVIDIA to fully open source their Linux GPU drivers, including user-space libraries and GSP firmware documentation.

**[Read the Letter](https://netplayz.github.io/nvidia-open-letter/)**

## What We're Asking

NVIDIA has made progress by open-sourcing their kernel modules (since R515). But the user-space components and GSP firmware remain closed. We're asking NVIDIA to complete the journey:

1. Open-source user-space driver components (OpenGL, Vulkan, CUDA libraries)
2. Publish GSP firmware documentation or release it openly
3. Maintain backwards compatibility for older driver branches
4. Engage with the upstream Linux kernel and Mesa communities

## Sign the Letter

### Via GitHub PR

1. Fork this repository
2. Add your entry to `signatures.md` (alphabetically by first name)
3. Open a pull request

### Via Email (no GitHub account needed)

Email **patches@ezmirror.net** with:

```
Name: Your Name
Title: Your Job Title
Affiliation: Your Company or "Independent"
GitHub: @yourhandle (optional)
```

Your signature is automatically added. See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

## How It Works

- `letter.md` -- The open letter content
- `signatures.md` -- Table of signers (Name, Title, Affiliation, GitHub)
- `style.css` -- Page styling
- `.github/workflows/build-letter.yml` -- Combines letter + signatures, converts to HTML via pandoc, deploys to GitHub Pages

The site rebuilds automatically whenever `letter.md` or `signatures.md` changes on `main`.

## Local Development

To preview locally (requires [pandoc](https://pandoc.org/)):

```sh
cat letter.md signatures.md | pandoc --standalone --embed-resources --css=style.css -o preview.html
```

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
