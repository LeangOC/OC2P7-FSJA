### main
1. Application est opérationnelle.
- Démarrer le backend  : $ java -jar build/libs/microcrm-0.0.1-SNAPSHOT.jar
- Démarrer le frontend : $ npx @angular/cli serve
- http://localhost:4200/  : ![main_page_acceuil.png](misc/screenshots/main_page_acceuil.png)

### develop < main
1. Implémentation ci.yml :
   - Un pipeline CI opérationnel dans GitHub Actions :  ![CI_Operationnel.png](misc/screenshots/CI_Operationnel.png)
   - Les tests existants sont exécutés automatiquement :    
           backend    
      ![Tests_Backend.png](misc/screenshots/Tests_Backend.png)      
  
      frontend   
      ![Tests_Frontend.png](misc/screenshots/Tests_Frontend.png)  
