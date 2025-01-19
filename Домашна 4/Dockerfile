FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

COPY ./src ./src

COPY pom.xml .

RUN apt-get update && \
    apt-get install -y maven

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
