# ---- Build stage ----
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the Backend folder (case-sensitive!)
COPY Backend ./Backend

# Go inside Backend folder
WORKDIR /app/Backend

# Build the Spring Boot project
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/Backend/target/*.jar app.jar

# Expose port 8080 for Render
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]