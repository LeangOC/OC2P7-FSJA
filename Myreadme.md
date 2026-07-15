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
