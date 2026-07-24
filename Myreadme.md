### main

1. Application est opérationnelle.
- Démarrer le backend  : $ java -jar build/libs/microcrm-0.0.1-SNAPSHOT.jar
- Démarrer le frontend : $ npx @angular/cli serve
- http://localhost:4200/  : ![main_page_acceuil.png](misc/screenshots/main_page_acceuil.png)

2. Analyse du fichier Dockerfile d'origine :
  - Trois images :
      - orion-microcrm-front : Linux Debian 12, Node.js version 22, Caddy + ressource Angular html
      - orion-microcrm-back  : Linux Ubuntu 22.04, Gradle 8.7, Java + ressource Spring-boot app.jar
      - orion-microcrm-standalone : images de front et back + supervisor  
      => Conclusion : Il y a une erreur ( EXPOSE 4200 pour le back)
  - Front conteneur:
      - docker build --target front -t orion-microcrm-front:latest .
      - docker run -it --rm -p 80:80 -p 443:443 orion-microcrm-front:latest
       ![Front_Container_Origin.png](misc/screenshots/Front_Container_Origin.png)  
  - Back conteneur:
      - docker build --target back -t orion-microcrm-back:latest .
      - docker run -it --rm -p 8080:8080 orion-microcrm-back:latest
        ![Back_Front_Containers_Origin.png](misc/screenshots/Back_Front_Containers_Origin.png)
  - Standalone conteneur:
      - docker build --target standalone -t orion-microcrm-standalone:latest .
      - docker run -it --rm -p 8080:8080 -p 80:80 -p 443:443 orion-microcrm-standalone:latest
      ![Standalone_Containers_Origin.png](misc/screenshots/Standalone_Containers_Origin.png)

### develop
1. Refonte du fichier Dockerfile origine :
    - Correction des erreurs :  
      - gradlew contenant symbole Control-M   
      - Ports EXPOSE  
    - Remplacer : Serveur web Caddy par Nginx  

2. Démarrage des nouveaux conteneurs
   - Front :
     - $ docker build --target front -t microcrm-front .
     - $ docker run -it --rm -p 80:80 microcrm-front:latest
   - Back :
     - docker build --target back -t microcrm-back:latest .
     - docker run -it --rm -p 8080:8080 microcrm-back:latest
     ![front_back_containers.png](misc/screenshots/front_back_containers.png)
   - Standalone 
     - docker build --target standalone -t microcrm-standalone:latest .
     - docker run -it --rm -p 8080:8080 -p 80:80  microcrm-standalone:latest  
     ![standalone_docker_container.png](misc/screenshots/standalone_docker_container.png)

3. Implémentation docker-compose.yml : Splitter le Dockerfile de refonte en deux Back et Front
   - Back image : back/Dockerfile , back/.dockerignore
   - Front image : front/Dockerfile , front/.dockerignore
   - Compose Docker : docker-compose.yml
     - $ docker compose up --build
     - $ docker compose ps :  
       ![Docker_Containers_microcrm.png](misc/screenshots/Docker_Containers_microcrm.png)

4. Implémentation Pipeline CI dans Github Action :  
   - phase 1 : Intégrer images Docker front et back dans le CI
      - Pipeline CI opérationnel dans GitHub Actions :  
      ![CI_Operationnel.png](misc/screenshots/CI_Operationnel.png)  
      - Les tests existants sont exécutés automatiquement :   
      backend :     
      ![Tests_Backend.png](misc/screenshots/Tests_Backend.png)      
      frontend :    
      ![Tests_Frontend.png](misc/screenshots/Tests_Frontend.png)  
   - phase 2 : Intégrer SonarCloud dans le CI :  
      - Pipeline CI finale   
      ![SonarCloud_Analysis.png](misc/screenshots/SonarCloud_Analysis.png)    
      - Intégration SonarCloud dans CI avec succès  
      ![sonarCloud_Analysis_Success.png](misc/screenshots/sonarCloud_Analysis_Success.png)  
      - https://sonarcloud.io :  
      ![SonarCloud_Analysis_Project.png](misc/screenshots/SonarCloud_Analysis_Project.png)  

5. Implémentation pipeline CD  
   - Refactor : ci.yml  
     ![Pipeline_ci_cd.png](misc/screenshots/Pipeline_ci_cd.png)  
   - Publication CD dans Docker Hub :  
     ![CD_Docker_Hub.png](misc/screenshots/CD_Docker_Hub.png)  

### Exercice 2 

6. Implémentation ELK
   - docker compose -f docker-compose-elk.yml up -d
     docker ps -a  
     ![ELK_Containers_Docker_Compose_Ps.png](misc/screenshots/ELK_Containers_Docker_Compose_Ps.png)

   - Elasticsearch : http://localhost:9200  
     ![ELK_Port_9200.png](misc/screenshots/ELK_Port_9200.png)      

   - Kibana : http://localhost:5601  
     ![ELK_Kibana_Port_5601_.png](misc/screenshots/ELK_Kibana_Port_5601_.png)  
   
7. Refactor Backend pour envoyer les logs vers ELK  
    - Implémentation : logback-spring.xml, application.properties, build.gradle
    - $ ./gradlew bootRun
    - Trace backend remontée sur Kibana
      ![Kibana_back_logs.png](misc/screenshots/Kibana_back_logs.png)  

8. Refactor Frontend pour remonter les logs vers Kibana ( via API Rest vers backend)
   - Implémentation : dto/FrontendLog.java, controller/FrontendLogController.java  
     API Post http://localhost:8080/api/logs :  
     ![Postman_Post_Api_logs_OK.png](misc/screenshots/Postman_Post_Api_logs_OK.png)  
     logs dans logstash :  
     ![Postman_Trace_Console.png](misc/screenshots/Postman_Trace_Console.png)  
   - implémentation logstash structurés : refactorer FrontendLogController.java  
     Avant : ![LogStash_before.png](misc/screenshots/LogStash_before.png)  
     Après : ![LogStash_After.png](misc/screenshots/LogStash_After.png)  

9. Brancher le frontend ( Envoyer Api logs vers backend)
    - Implémentation : services/logging.service.ts, app.components.ts
      ![Logs_Console_Chrome_frontend_Api.png](misc/screenshots/Logs_Console_Chrome_frontend_Api.png)  

10. Journalisation des évènements :  
    - PersonDetailsComponent  
    ![Logstash_frontend_person_event.png](misc/screenshots/Logstash_frontend_person_event.png)  
    - OrganizationDetailsComponent     
      ![Logstash_frontend_Organization_event.png](misc/screenshots/Logstash_frontend_Organization_event.png) 
    - Dans Logstash  
      ![Logstash_front.png](misc/screenshots/Logstash_front.png)  

11. Configurer Kibana visualisation   
    - Dashboard :  
    ![Dashboard_Journalisation_Logs.png](misc/screenshots/Dashboard_Journalisation_Logs.png)