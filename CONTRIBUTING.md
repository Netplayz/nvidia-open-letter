# Contributing

There are two ways to sign the open letter: via GitHub pull request, or via email.

## Signing via GitHub PR

1. Fork this repository
2. Edit `signatures.md` -- add your row alphabetically by first name
3. Open a pull request

Your entry should follow this format:

```
| Your Name | Your Title / Role | Your Affiliation | [@yourhandle](https://github.com/yourhandle) |
```

## Signing via Email (no GitHub account required)

Send an email to **patches@nvidia.ezmirror.net** with your details.

### Option A: Plain email (easiest)

Just send an email with these lines in the body:

```
Name: Jane Doe
Title: Senior Linux Engineer
Affiliation: Red Hat
GitHub: @janedoe
```

`GitHub` is optional -- omit it or write `N/A` if you don't have an account.

That's it. The email is automatically parsed and your signature is committed to the repo.

### Option B: Git patch (for advanced users)

If you prefer the traditional git-email workflow:

1. Clone the repo and edit `signatures.md`
2. Commit with `git commit -s -m "Sign: Your Name"`
3. Generate a patch: `git format-patch -1 HEAD`
4. Attach the `.patch` file to your email

### What happens next

1. Your email arrives at `patches@nvidia.ezmirror.net`
2. A Cloudflare Email Worker parses your details
3. It triggers a GitHub Actions workflow via `repository_dispatch`
4. The workflow commits your signature and pushes to `main`
5. The website rebuilds automatically with your name

You'll receive an auto-reply confirming your signature was added.

## Maintainer: Manual Quick-Add

If someone emails you their details directly, you can add them from the Actions tab:

1. Go to **Actions > Apply Email Patch > Run workflow**
2. Fill in: Name, Title, Affiliation, GitHub (or N/A)
3. Run workflow

## Email Infrastructure

The email pipeline uses:

- **Cloudflare Email Worker** (`cloudflare-email-worker/worker.js`) -- receives and parses emails
- **GitHub Actions** (`.github/workflows/email-patch.yml`) -- applies signatures

### Cloudflare Setup

1. Deploy the worker: `cd cloudflare-email-worker && wrangler deploy`
2. Set secrets:
   ```sh
   wrangler secret put GITHUB_TOKEN   # fine-grained PAT with contents:write
   wrangler secret put GITHUB_REPO    # e.g. "Netplayz/nvidia-open-letter"
   ```
3. In Cloudflare Dashboard > Email Routing:
   - Add address: `patches@nvidia.ezmirror.net`
   - Route to the `nvidia-open-letter-email` worker
