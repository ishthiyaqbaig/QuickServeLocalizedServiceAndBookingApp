# QuickServe App

A simple team project containing **frontend** (React + Vite) and **backend** (Spring Boot)**.**

This guide helps every team member understand **how to use Git properly** for our first project.

---

## 🚀 How to Start

### 1. Clone the repository

```
git clone <repo-url>
cd QuickServeApp
```

---

## 🛠 Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔧 Backend Setup

Open backend in any IDE (IntelliJ / STS / VS Code) and run:

```
mvn spring-boot:run
```

---

## 🌿 Git Workflow (Very Simple)

### ✅ Step 1: Always create a new branch

```
git checkout -b feature-taskname
```

Example:

```
git checkout -b feature-login
```

### ✅ Step 2: Work on your code

Make changes normally.

### ✅ Step 3: Add & Commit

```
git add .
git commit -m "Your message here"
```

### ✅ Step 4: Push your branch

```
git push -u origin feature-taskname
```

### ✅ Step 5: Create Pull Request

1. Go to GitHub repo
2. Click **Pull Request**
3. Select your branch → target `main` branch
4. Create PR
5. Team will review & merge

---

## ⚠ Rules (Simple)

* ❌ **Do NOT push directly to main**
* ✔ **Always create a feature branch**
* ✔ **Always create a pull request**

---

## 🎉 Done!

This simple workflow keeps our first project clean and easy for everyone.
