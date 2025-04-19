# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-04-19

### Added

- AI Suggestion Extension with content improvement capabilities
- Google Generative AI integration for content analysis
- Visual highlighting for suggestions in the editor
- Comprehensive documentation for the AI Suggestions extension

### Changed

- Updated core dependencies
- Improved extension configuration options
- Enhanced decoration rendering for highlighted suggestions

### Fixed

- Issue with selection update handling
- Improved document position mapping for suggestions
- Length validation to prevent overly large suggestion blocks
- Wrong positions of slash command popover for editor with large contents

- Fixed #24: Suggestion position mapping issues after applying changes
  - Added proper position validation and updating for remaining suggestions
  - Improved handling of document changes affecting suggestion ranges
  - Added fallback text search when positions become invalid
  - Enhanced decoration updates during suggestion application

## [1.0.0] - 2025-01-13

### Added

- Initial release of the Notion-like editor template
- Rich text editing with Notion-like interface
- Draggable blocks for content reorganization
- Slash commands for quick actions
- Task lists and checklists
- Text formatting options (underline, colors, alignment, etc.)
- Responsive design
- Markdown import/export functionality
