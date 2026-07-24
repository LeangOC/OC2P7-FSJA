### main
1. Application est opérationnelle.
- Démarrer le backend  : $ java -jar build/libs/microcrm-0.0.1-SNAPSHOT.jar
- Démarrer le frontend : $ npx @angular/cli serve
- http://localhost:4200/  : ![main_page_acceuil.png](misc/screenshots/main_page_acceuil.png)

### develop < main
1. Implémentation ci.yml : phase 1
   - Un pipeline CI opérationnel dans GitHub Actions :  ![CI_Operationnel.png](misc/screenshots/CI_Operationnel.png)
   - Les tests existants sont exécutés automatiquement :    
           backend    
      ![Tests_Backend.png](misc/screenshots/Tests_Backend.png)      
  
      frontend   
      ![Tests_Frontend.png](misc/screenshots/Tests_Frontend.png)  

2. refactor ci.yml: phase 2
   -  SonarCloud analysis : sonar-project.properties
      ![SonarCloud_Analysis.png](misc/screenshots/SonarCloud_Analysis.png)
      ![sonarCloud_Analysis_Success.png](misc/screenshots/sonarCloud_Analysis_Success.png)
      ![SonarCloud_Analysis_Project.png](misc/screenshots/SonarCloud_Analysis_Project.png)

### develop1
1. Dockerfile : back/Dockerfile , back/.dockerignore
   - Création image Docker microcrm-back : $ docker build -t microcrm-back ./back
   - $ docker images | grep micro
     > microcrm-back:latest       9526fe944064        465MB          136MB
   

### develop2
1. Dockerfile : front/Dockerfile , front/.dockerignore
- docker build -t microcrm-front ./front
- $ docker images | grep micro
  > microcrm-front:latest            59c07ac44ee2       74.1MB         21.1MB

### develop3
1. Implémentation : docker-compose.yml
- $ docker compose up --build
- $ docker compose ps :  
 ![Docker_Containers_microcrm.png](misc/screenshots/Docker_Containers_microcrm.png)

### develop4
1. Un pipeline CD opérationnel
- Refactor : ci.yml

### develop_save_before_CD
- Sauvegard de la branche develop avant la pipeline CD

### develop merge from develop4
- site sonarCloud incident Http 504 : désactiver le job sonaCloud dans le ci.yml
- Erreur d'exécution fichier gradlew : correction Dockerfile ( chmod +x ) 
- Publication CD dans Docker Hub :
  ![CD_Docker_Hub.png](misc/screenshots/CD_Docker_Hub.png)
- Réactivation du job sonarCloud

### develop5 
1. Implémentation ELK
  - docker compose -f docker-compose-elk.yml up -d
    docker ps -a
    ![docker-compose_ps.png](misc/screenshots/docker-compose_ps.png)

  - Elasticsearch : http://localhost:9200 
    ![ELK_Port_9200.png](misc/screenshots/ELK_Port_9200.png)

  - Kibana : http://localhost:5601
    ![ELK_Kibana_Port_5601_.png](misc/screenshots/ELK_Kibana_Port_5601_.png)

2. Refactor Backend pour envoyer les logs vers ELK
   - Implémentation : logback-spring.xml, application.properties, build.gradle
   - $ ./gradlew bootRun
   - Trace backend remontée sur Kibana
    ![Kibana_back_logs.png](misc/screenshots/Kibana_back_logs.png)

### develop6
1. logs frontend dans Kibana
- implémentation : dto/FrontendLog.java, controller/FrontendLogController.java
  API Post http://localhost:8080/api/logs :
  ![Postman_Post_Api_logs_OK.png](My/MyEtapes/develop6/Postman_Post_Api_logs_OK.png)
  logs dans logstash :
  ![Postman_Trace_Console.png](My/MyEtapes/develop6/Postman_Trace_Console.png)
- implémentation logstash structurés : refactorer FrontendLogController.java
  Avant : ![LogStash_before.png](My/MyEtapes/develop6/LogStash_before.png)  
  Après : ![LogStash_After.png](My/MyEtapes/develop6/LogStash_After.png)

### develop7
1. brancher le frontend
   - Implémentation : services/logging.service.ts, app.components.ts
   ![Logs_Console_Chrome_frontend_Api.png](My/MyEtapes/develop7/Logs_Console_Chrome_frontend_Api.png)

### develop8
1. Journaliser les événements : PersonDetailsComponent
   ![Logstash_frontend_person_event.png](My/MyEtapes/develop8/Logstash_frontend_person_event.png)  
2. Journaliser les événements : OrganizationDetailsComponent  
    ![Logstash_frontend_Organization_event.png](My/MyEtapes/develop8/Logstash_frontend_Organization_event.png)  
Et dans logstash :
   ![Logstash_front.png](My/MyEtapes/develop8/Logstash_front.png)

3. Configurer Kibana Data View ( déjà effectué avant )
4. Configurer Kibana Visualisation