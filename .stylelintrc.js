// https://maximgatilin.github.io/stylelint-config/
// https://stylelint.io/user-guide/example-config/
module.exports = {
  "plugins": [
      "stylelint-csstree-validator"
  ],
  "extends": "stylelint-config-standard",
  "rules": {
    "csstree/validator": true,
    "comment-empty-line-before": [ "always", {
      "ignore": ["stylelint-commands", "between-comments"],
    } ],

    "block-no-empty": null,
    "color-hex-case": "lower",
    "color-no-invalid-hex": true,
    "comment-empty-line-before": "always",
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "font-family-name-quotes": "always-where-recommended",
    "indentation": 2,
    "max-empty-lines": 1,
    "media-feature-colon-space-after": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always",
    "no-duplicate-selectors": true,
    "number-leading-zero": "always",
    "rule-empty-line-before": "always-multi-line",
    "selector-attribute-brackets-space-inside": "never",
    "selector-attribute-operator-space-after": "never",
    "selector-attribute-operator-space-before": "never",
    "selector-attribute-quotes": "always",
    "selector-combinator-space-after": "always",
    "selector-list-comma-newline-after": "always",
    "selector-pseudo-class-parentheses-space-inside": "always",
    "selector-pseudo-element-colon-notation": "double",
    "string-quotes": "single",
    "unit-whitelist": ["em", "rem", "%", "px", "s", "deg"]
  }
}
