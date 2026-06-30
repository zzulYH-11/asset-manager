package com.yuha.asset_manager;

import com.yuha.asset_manager.entity.Member;
import com.yuha.asset_manager.repository.MemberRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AssetManagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssetManagerApplication.class, args);
	}

	@Bean
	public CommandLineRunner initTestData(MemberRepository memberRepository) {
		return args -> {
			// 테스트용 기본 회원이 하나도 없으면 생성 (첫 번째 등록 회원은 Auto Increment로 1번 ID 부여됨)
			if (memberRepository.count() == 0) {
				Member member = new Member();
				memberRepository.save(member);
				System.out.println("=== 🚀 테스트용 기본 회원(memberId=1)이 데이터베이스에 생성되었습니다. ===");
			}
		};
	}
}
