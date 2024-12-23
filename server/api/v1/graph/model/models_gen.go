// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AuthResponse struct {
	User    *UserAccount `json:"user"`
	Token   string       `json:"token"`
	Message *string      `json:"message,omitempty"`
}

type Mutation struct {
}

type Query struct {
}

type UserAccount struct {
	ID          string       `json:"id"`
	Username    string       `json:"username"`
	Email       string       `json:"email"`
	PhoneNumber *string      `json:"phoneNumber,omitempty"`
	CreatedAt   string       `json:"createdAt"`
	Profile     *UserProfile `json:"profile,omitempty"`
}

type UserProfile struct {
	ID          string  `json:"id"`
	Description *string `json:"description,omitempty"`
	AvatarURL   *string `json:"avatarUrl,omitempty"`
	Username    string  `json:"username"`
}
