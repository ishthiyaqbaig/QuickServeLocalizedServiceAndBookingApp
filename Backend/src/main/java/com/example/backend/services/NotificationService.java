package com.example.backend.services;

import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import com.example.backend.repositories.NotificationRepository;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.example.backend.enums.Role.SERVICE_PROVIDER;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void sendNotification(Long userId, String message) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId).orElseThrow();
        n.setIsRead(true);
        notificationRepository.save(n);
    }

    public void notifyAllProviders(String message) {
        List<User> providers = userRepository.findByRole(SERVICE_PROVIDER);

        for (User provider : providers) {
            Notification notification = new Notification();
            notification.setUserId(provider.getId());
            notification.setMessage(message);
            notification.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
    }
}
