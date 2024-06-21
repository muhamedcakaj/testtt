package user.Entity;




import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import user.Security.Role;


import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user_table")
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "namee")
    private String name;
    private String surname;
    @Column(name = "user_name") // Update this to match your database column name
    private String username;

    @Column(name = "passwordd")
    private String password;
    private String user_telephone_number;
    private String user_address;
    private String user_email;

    @Enumerated(value=EnumType.STRING)
    @Column(name = "user_role", columnDefinition = "varchar(10) default 'USER'")
    private Role user_role;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getUsername() {
        return username;
   }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public String getPassword() {
        return password;
    }
    public void setPasswordd(String passwordd){
        this.password=passwordd;
    }
    public String getUser_TelephoneNumber() {
        return user_telephone_number;
    }

    public void setUser_TelephoneNumber(String user_TelephoneNumber) {
        this.user_telephone_number = user_TelephoneNumber;
    }

    public String getUser_Address() {
        return user_address;
    }

    public void setUser_Address(String user_Address) {
        this.user_address = user_Address;
    }

    public String getUser_email() {
        return user_email;
    }

    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }

    public Role getRole() {
        return user_role;
    }

    public void setRole(Role role) {
        this.user_role = role;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(user_role.name()));
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

