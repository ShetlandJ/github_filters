# GitHub Filter Manager

A Chrome extension that allows you to save and manage your GitHub filters with ease.

## Features

- **Save Filters**: Save your current GitHub search filters with custom names
- **Quick Access**: View all your saved filters in a convenient panel
- **One-Click Apply**: Apply any saved filter instantly
- **Easy Management**: Delete filters you no longer need

## How to Use

1. Navigate to any GitHub repository's Issues or Pull Requests page
2. Apply your desired filters (e.g., `is:pr is:open -reviewed-by:@me -author:@me`)
3. Click the "Save Filter" button in the navigation bar
4. Give your filter a memorable name and save it
5. Use "Show Filters" to view and apply your saved filters anytime

## Example Filters

- **Open PRs not by me**: `is:pr is:open -reviewed-by:@me -author:@me`
- **My open issues**: `is:issue is:open author:@me`
- **High priority bugs**: `is:issue is:open label:bug label:priority-high`

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Navigate to any GitHub repository to start using the extension

## Permissions

- `activeTab`: To access the current GitHub page
- `storage`: To save your filters locally
- `https://github.com/*`: To run only on GitHub pages