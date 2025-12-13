//package com.example.backend.config;
//
//
//import io.swagger.v3.oas.models.Components;
//import io.swagger.v3.oas.models.OpenAPI;
//import io.swagger.v3.oas.models.info.Info;
//import io.swagger.v3.oas.models.security.SecurityRequirement;
//import io.swagger.v3.oas.models.security.SecurityScheme;
//import io.swagger.v3.oas.models.tags.Tag;
//import org.apache.catalina.Server;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.Arrays;
//import java.util.List;
//
//@Configuration
//public class SwaggerConfig {
//
//    @Bean
//    public OpenAPI muCustomConfig(){
//        return new OpenAPI()
//                .info(
//                        new Info().title("Quick serve Localized Service and booking app API's")
//                                .description("by Neeraj")
//                );
//
//
////                .servers(Arrays.asList(new Server().url("http://localhost:8081").description("local")
////                        ,new Server().url("http://localhost:8081").description("live")));
//    }
//}
//
