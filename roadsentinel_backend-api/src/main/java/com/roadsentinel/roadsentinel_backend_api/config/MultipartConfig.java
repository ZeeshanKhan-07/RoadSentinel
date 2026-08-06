package com.roadsentinel.roadsentinel_backend_api.config;

import jakarta.servlet.MultipartConfigElement;

import org.apache.coyote.http11.AbstractHttp11Protocol;
import org.springframework.boot.servlet.MultipartConfigFactory;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;

@Configuration
public class MultipartConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofMegabytes(200));
        factory.setMaxRequestSize(DataSize.ofMegabytes(500));
        return factory.createMultipartConfig();
    }

    @Bean
    public TomcatServletWebServerFactory tomcatFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.addConnectorCustomizers(connector -> {
            AbstractHttp11Protocol<?> protocol = (AbstractHttp11Protocol<?>) connector.getProtocolHandler();
            connector.setProperty("maxPartCount", "50");
        });
        return factory;
    }
}
