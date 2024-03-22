````markdown
# Code Convention cho dự án Express sử dụng TypeScript, ESLint và Prettier

## Cài đặt các extension cần thiết cho VSCode

Đảm bảo rằng bạn đã cài đặt các extension sau trong VSCode: ESLint, Prettier.

## Cấu hình ESLint

Tạo một file `.eslintrc.json` trong thư mục gốc của dự án với nội dung sau:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended", "prettier/@typescript-eslint", "plugin:prettier/recommended"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    // Thêm các quy tắc ESLint tại đây
  }
}
```
````

## Cấu hình Prettier

Tạo một file `.prettierrc` trong thư mục gốc của dự án với nội dung sau:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Sử dụng TypeScript

Đảm bảo rằng bạn đã cài đặt TypeScript và cấu hình `tsconfig.json` phù hợp với dự án của bạn.

## Cấu trúc thư mục

Một cấu trúc thư mục phổ biến cho dự án Express/TypeScript có thể như sau:

```
.
├── src
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── app.ts
├── test
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── .prettierrc
```

## Quy tắc đặt tên

Sử dụng camelCase cho biến và hàm, PascalCase cho lớp và interface.

## Quy tắc viết comment

Viết comment cho các hàm phức tạp, các lớp và interface.

## Quản lý dependencies

Sử dụng `package.json` để quản lý các dependencies và scripts.

## Quy tắc viết test

Viết test cho các hàm quan trọng và chạy chúng trước khi commit.

## Sử dụng Git

Sử dụng Git để quản lý phiên bản và GitHub để lưu trữ mã nguồn.

```

Lưu ý: Đây chỉ là một số quy tắc cơ bản, bạn có thể tùy chỉnh chúng theo nhu cầu của dự án của bạn.
```
