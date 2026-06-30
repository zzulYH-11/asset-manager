# Architecture

## 시스템 아키텍처

```
                +---------------------+
                |      Browser        |
                +----------+----------+
                           |
                           |
                     HTTPS Request
                           |
                           v
                +---------------------+
                |   Frontend (React)  |
                |       Vercel        |
                +----------+----------+
                           |
                    REST API (HTTPS)
                           |
                           v
                +---------------------+
                | Spring Boot Backend |
                |       Render        |
                +----------+----------+
                           |
                           |
                     JPA / Hibernate
                           |
                           v
                +---------------------+
                |      Database       |
                |      PostgreSQL     |
                +---------------------+
```

---

# 기술 스택

| Layer | Technology |
|--------|------------|
| Frontend | React (v19) + Vite (v8) |
| Backend | Spring Boot (Java) |
| Database | PostgreSQL |
| Deployment | Vercel (Frontend), Render (Backend) |
| Version Control | Git + GitHub |
| CI/CD | GitHub Actions |

---

# 프로젝트 구조

```text
project/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── README.md
│
└── .github/
```

---

# Backend Architecture

패키지 구조

```text
backend/src/main/java

controller

service

repository

entity

dto

config

exception
```

---

# Frontend Architecture

폴더 구조

```text
frontend/src

components

pages

hooks

services

utils

assets
```

---

# API Architecture

통신 방식

```
Browser

↓

React

↓

Axios

↓

Spring Controller

↓

Service

↓

Repository

↓

Database
```

---

# Authentication

인증 방식

-

토큰 저장 위치

-

인가 방식

-

---

# Database

ERD

> docs/assets/erd.png

주요 테이블

-

-

-

---

# Deployment

## Frontend

Platform

-

Build

-

Domain

-

---

## Backend

Platform

-

Build

-

Domain

-

---

## Database

Platform

-

---

# CI/CD

배포 흐름

```
Developer

↓

Git Commit

↓

Git Push

↓

GitHub

↓

GitHub Actions

↓

Frontend Deploy

↓

Backend Deploy
```

---

# Environment Variables

## Frontend

```env
VITE_API_URL=
```

---

## Backend

```env
SPRING_DATASOURCE_URL=

SPRING_DATASOURCE_USERNAME=

SPRING_DATASOURCE_PASSWORD=

JWT_SECRET=
```

---

# External Services

사용하는 외부 서비스

-

-

-

---

# 향후 확장 계획

예정된 아키텍처 변경

-

-

-