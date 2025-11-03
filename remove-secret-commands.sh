#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# EDIT THIS: set your repo URL
# Replace with your actual repo path: https://github.com/<your-username>/<repo>.git
# If the repo is private and you prefer SSH: use git@github.com:<your-username>/<repo>.git
REPO_URL=https://github.com/nifrmp/spotify-growth-dashboard-prototypyebyn-.git
# ---------------------------

echo "1) Quick path: secret only in most recent commit"
echo "   Run these from your working repo (not mirror):"
echo
echo "   git rm --cached .env"
echo "   git commit -m \"remove .env from repo\""
echo "   git push origin main"
echo
echo "If the push is blocked or secret exists earlier in history, continue below."

echo
echo "2) Check/install git-filter-repo (recommended)"
echo "   On Windows/macOS/Linux with Python/pip available:"
echo "     python3 -m pip install --user git-filter-repo"
echo "   Verify:"
echo "     git filter-repo --help || echo 'install failed or not on PATH'"
echo
echo "Alternative: use BFG (requires Java)."

echo
echo "3) Mirror-rewrite with git-filter-repo (run only after verifying REPO_URL above)"
echo "   NOTE: cloning mirror requires the repo to exist and you to have access."
echo "   Replace REPO_URL if needed."
echo
echo "   git clone --mirror \"${REPO_URL}\" repo-mirror.git"
echo "   cd repo-mirror.git"
echo "   # Remove .env from all commits"
echo "   git filter-repo --invert-paths --paths .env"
echo "   # Push rewritten history back (force)"
echo "   git push --force --all"
echo "   git push --force --tags"
echo
echo "If 'git clone' fails with 'Repository not found':"
echo " - double-check REPO_URL spelling and that the repo exists"
echo " - if private, ensure you can authenticate (SSH keys or PAT)"
echo " - you can use an authenticated URL: https://<TOKEN>@github.com/your-username/your-repo.git (token should be revoked after use)"
echo
echo "If 'git filter-repo' is not found after install:"
echo " - ensure Python user's bin directory is on PATH (e.g. %APPDATA%/Python/Scripts on Windows or ~/.local/bin on Linux)"
echo " - or run via python: python3 -m git_filter_repo ... (check docs)"
echo
echo "4) BFG alternative (if you prefer):"
echo "   # clone mirror"
echo "   git clone --mirror \"${REPO_URL}\" repo-mirror.git"
echo "   cd repo-mirror.git"
echo "   # download BFG jar and run (example)"
echo "   java -jar path/to/bfg.jar --delete-files .env"
echo "   git reflog expire --expire=now --all && git gc --prune=now --aggressive"
echo "   git push --force --all"
echo
echo "5) After rewrite:"
echo " - Revoke/rotate the leaked key immediately (most important)."
echo " - Re-clone your repo fresh and verify the secret is gone."
echo " - Ensure .env is in .gitignore (file above)."
echo
echo "If you paste the exact clone URL you used and any console errors (after removing any real secrets), I can point out the exact typo or permission issue."
