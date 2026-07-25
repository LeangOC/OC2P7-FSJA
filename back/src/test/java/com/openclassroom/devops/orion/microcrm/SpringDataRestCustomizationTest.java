package com.openclassroom.devops.orion.microcrm;

import org.junit.jupiter.api.Test;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.mockito.Mockito.*;

class SpringDataRestCustomizationTest {

    @Test
    void shouldConfigureRestRepositories() {

        SpringDataRestCustomization customization =
                new SpringDataRestCustomization();

        RepositoryRestConfiguration configuration =
                mock(RepositoryRestConfiguration.class);

        CorsRegistry registry = new CorsRegistry();

        customization.configureRepositoryRestConfiguration(configuration, registry);

        verify(configuration).exposeIdsFor(Person.class, Organization.class);
    }

}
