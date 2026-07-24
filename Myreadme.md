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

### master < develop ( pour démonstration)