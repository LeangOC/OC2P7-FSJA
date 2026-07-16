# ============================================================
# Stage 1 : Build de l'application Spring Boot
# ============================================================

FROM gradle:8.7-jdk17 AS builder

WORKDIR /app

# Copie de l'ensemble du projet backend
COPY . .
RUN chmod +x gradlew
# Construction de l'application sans relancer les tests
RUN ./gradlew clean build -x test

# ============================================================
# Stage 2 : Image d'exécution légère
# ============================================================

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copie du JAR généré
COPY --from=builder /app/build/libs/*.jar app.jar

# Port Spring Boot
EXPOSE 8080

# Lancement de l'application
ENTRYPOINT ["java","-jar","app.jar"]